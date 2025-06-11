const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { validarCNPJ } = require('../../../shared/validators/backend')
const { sendSuccess, sendError } = require('../../../shared/utils/sendResponse')

/**
 * Sleep helper
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Consulta a ReceitaWS com retry para 429
 */
async function consultarReceitaWSComRetry(cnpj, maxRetries = 2, delayMs = 1000) {
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      console.log(`[ReceitaWS] Tentativa ${attempt + 1} para CNPJ ${cnpj}`)

      const receitaRes = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)

      console.log(`[ReceitaWS] Status: ${receitaRes.status}`)

      return receitaRes.data
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.statusText;
      const data = err.response?.data;

      console.error(`[ReceitaWS] Erro tentativa ${attempt + 1} | Status: ${status} | Message: ${message}`);
      if (data) {
        console.error(`[ReceitaWS] Response body:`, data);
      }

      // Se 429 → tenta novamente ou lança MAX_RETRIES_EXCEEDED
      if (status === 429) {
        if (attempt < maxRetries) {
          console.warn(`[ReceitaWS] 429 - aguardando ${delayMs}ms para nova tentativa...`);
          await sleep(delayMs);
          attempt++;
          continue;
        } else {
          throw new Error('MAX_RETRIES_EXCEEDED');
        }
      }

      // Se 404 → lança erro para ser tratado no controller
      if (status === 404 && data?.message === 'not in cache') {
        throw new Error('NOT_IN_CACHE');
      }

      // Outro erro → lança erro genérico
      throw new Error('API_ERROR');
    }
  }

  throw new Error('MAX_RETRIES_EXCEEDED')
}

/**
 * Controller consultar CNPJ
 */
exports.consultarCNPJ = async (req, res) => {
  const { cnpj } = req.params
  const { cpf } = req.user

  if (!validarCNPJ(cnpj)) {
    return sendError(res, 400, 'CNPJ inválido. Verifique o número digitado.')
  }

  try {
    // Verifica se o usuário já consultou esse CNPJ
    const consultaExistente = await prisma.consulta.findFirst({
      where: { cpf, cnpj }
    })

    // Tenta pegar os dados do cache
    let dadosCNPJ = await prisma.dadosCNPJ.findUnique({
      where: { cnpj }
    })

    let novaConsulta = consultaExistente
    let consultado = true

    if (!dadosCNPJ) {
      console.log(`[ReceitaWS] Cache não encontrado para CNPJ ${cnpj}`);

      let empresa

      try {
        empresa = await consultarReceitaWSComRetry(cnpj)

        if (!empresa?.status || !empresa?.nome) {
          throw new Error('INVALID_API_RESPONSE')
        }

      } catch (error) {
        console.error(`[ReceitaWS] Erro inesperado:`, error)

        // Se não havia consulta → cria como Pendente + marca como Erro
        if (!consultaExistente) {
          try {
            novaConsulta = await prisma.consulta.create({
              data: {
                nome: 'Empresa não identificada',
                cpf,
                cnpj,
                status: 'Pendente'
              }
            })

            await prisma.consulta.update({
              where: { id: novaConsulta.id },
              data: { status: 'Erro' }
            })

            novaConsulta.status = 'Erro'
            console.log(`[ReceitaWS] Status da nova consulta ${novaConsulta.id} atualizado para 'Erro'`)
          } catch (updateErr) {
            console.error(`[ReceitaWS] Erro ao criar/atualizar consulta para 'Erro':`, updateErr)
          }
        }

        // Decide tipo de erro para resposta
        if (error.message === 'NOT_IN_CACHE') {
          return sendError(res, 404, 'Ainda não temos informações sobre este CNPJ. Nosso sistema está sempre se atualizando para proteger você de possíveis fraudes.')
        }

        if (error.message === 'MAX_RETRIES_EXCEEDED') {
          return sendError(res, 429, 'Limite de consultas atingido. Tente novamente em breve!')
        }

        if (error.message === 'INVALID_API_RESPONSE') {
          return sendError(res, 502, 'Resposta inválida da ReceitaWS.')
        }

        // Erro genérico
        return sendError(res, 500, 'Erro ao consultar dados da ReceitaWS.')
      }

      // Se sucesso → salva no cache
      dadosCNPJ = await prisma.dadosCNPJ.create({
        data: {
          cnpj,
          dados: empresa
        }
      })

      console.log(`[ReceitaWS] Cache criado para CNPJ ${cnpj}`)
    } else {
      console.log(`[ReceitaWS] Usando cache para CNPJ ${cnpj}`)

      if (!dadosCNPJ?.dados || typeof dadosCNPJ.dados !== 'object') {
        return sendError(res, 502, 'Resposta inválida da ReceitaWS.')
      }
    }

    // Se não havia consulta → cria como Pendente
    if (!consultaExistente) {
      novaConsulta = await prisma.consulta.create({
        data: {
          nome: dadosCNPJ.dados.nome || dadosCNPJ.dados.fantasia || 'Empresa não identificada',
          cpf,
          cnpj,
          status: 'Pendente'
        }
      })
      consultado = false
    }

    // Atualiza status para Consultado se foi sucesso (somente se estava como Pendente)
    if (novaConsulta.status === 'Pendente') {
      try {
        await prisma.consulta.update({
          where: { id: novaConsulta.id },
          data: { status: 'Consultado' }
        })

        novaConsulta.status = 'Consultado'
        console.log(`[ReceitaWS] Status da consulta ${novaConsulta.id} atualizado para 'Consultado'`)
      } catch (updateErr) {
        console.error(`[ReceitaWS] Erro ao atualizar status para 'Consultado':`, updateErr)
      }
    }

    // Retorno completo
    return sendSuccess(res, {
      consultado,
      consulta: {
        id: novaConsulta.id,
        cpf: novaConsulta.cpf,
        cnpj: novaConsulta.cnpj,
        status: novaConsulta.status,
        criadoEm: novaConsulta.criadoEm
      },
      empresa: dadosCNPJ.dados
    })
  } catch (err) {
    console.error('Erro ao consultar CNPJ:', err)
    return sendError(res, 500, 'Erro interno ao consultar CNPJ.', {
      consulta: null,
      empresa: null
    })
  }
}

/**
 * Lista todas as consultas feitas pelo usuário autenticado.
 */
exports.listarConsultas = async (req, res) => {
  const { cpf, email, nome } = req.user  // ✅ incluir nome
  const {
    page = 1,
    limit = 5,
    status,
    data,
    nome: filtroNome,
    cnpj
  } = req.query

  try {
    // monta filtro dinâmico
    const where = { cpf }

    if (status) {
      where.status = status.toLowerCase()
    }

    if (data) {
      // filtra data no campo criadoEm → apenas YYYY-MM-DD
      const start = new Date(`${data}T00:00:00.000Z`)
      const end = new Date(`${data}T23:59:59.999Z`)
      where.criadoEm = {
        gte: start,
        lte: end
      }
    }

    if (filtroNome) {
      where.nome = {
        contains: filtroNome
      }
    }

    if (cnpj) {
      where.cnpj = {
        contains: cnpj.replace(/[^\d]+/g, '') // limpa máscara e faz contains
      }
    }

    // Conta total (para paginação)
    const total = await prisma.consulta.count({ where })

    // Busca paginada
    const consultas = await prisma.consulta.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      select: {
        id: true,
        nome: true,
        cpf: true,
        cnpj: true,
        status: true,
        criadoEm: true,
      }
    })

    return sendSuccess(res, {
      usuario: { cpf, email, nome },  // ✅ incluir nome no retorno
      total,
      resultados: consultas.map((c) => ({
        ...c,
        criadoFormatado: new Date(c.criadoEm).toLocaleString('pt-BR')
      }))
    })
  } catch (err) {
    console.error(`Erro ao listar consultas para CPF ${cpf}:`, err)

    return sendError(res, 500, 'Erro ao listar consultas', {
      usuario: { cpf, email, nome },  // manter consistência mesmo em erro
      total: 0,
      resultados: []
    })
  }
}