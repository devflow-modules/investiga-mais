const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { validarCNPJ } = require('../../../shared/validators/backend');

exports.consultarCNPJ = async (req, res) => {
  const { cnpj } = req.params
  const { cpf } = req.user

  if (!validarCNPJ(cnpj)) {
    return res.status(400).json({ erro: 'CNPJ inválido. Verifique o número digitado.' })
  }

  try {
    // 🔁 Verifica se o usuário já consultou esse CNPJ
    const consultaExistente = await prisma.consulta.findFirst({
      where: { cpf, cnpj }
    })

    // 📦 Tenta pegar os dados do cache local
    let dadosCNPJ = await prisma.dadosCNPJ.findUnique({
      where: { cnpj }
    })

    // 🌐 Se não existe no cache, consulta a ReceitaWS
    if (!dadosCNPJ) {
      const receitaRes = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)
      const empresa = receitaRes.data

      if (empresa.status === 'ERROR') {
        return res.status(404).json({ erro: 'CNPJ não encontrado na base da ReceitaWS.' })
      }

      // 💾 Salva os dados brutos no cache
      dadosCNPJ = await prisma.dadosCNPJ.create({
        data: {
          cnpj,
          dados: empresa
        }
      })
    }

    // ✅ Cria a consulta para o usuário atual, se ainda não houver
    let novaConsulta = consultaExistente
    let consultado = true

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

    // ✅ Retorno completo ao frontend
    return res.json({
      sucesso: true,
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
    return res.status(500).json({ erro: 'Erro interno ao consultar CNPJ.' })
  }
}

/**
 * Lista todas as consultas feitas pelo usuário autenticado.
 */
exports.listarConsultas = async (req, res) => {
  const { cpf, email } = req.user

  try {
    const consultas = await prisma.consulta.findMany({
      where: { cpf },
      orderBy: { criadoEm: 'desc' },
      take: 50,
      select: {
        id: true,
        nome: true,
        cpf: true,
        cnpj: true,
        status: true,
        criadoEm: true,
      }
    })

    return res.json({
      sucesso: true,
      usuario: { cpf, email },
      resultados: consultas.map((c) => ({
        ...c,
        criadoFormatado: new Date(c.criadoEm).toLocaleString('pt-BR')
      }))
    })
  } catch (err) {
    console.error(`Erro ao listar consultas para CPF ${cpf}:`, err)
    return res.status(500).json({ erro: 'Erro ao listar consultas' })
  }
}
