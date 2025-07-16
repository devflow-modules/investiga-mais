const axios = require('axios');
const prisma = require('../lib/prisma.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔁 Consulta com retry na ReceitaWS
async function consultarReceitaWSComRetry(cnpj) {
  const maxRetries = 3;
  const delayMs = 300;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    console.log(`[ReceitaWS] Tentativa ${attempt + 1} para CNPJ ${cnpj}`);

    try {
      const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`);

      if (response.status === 200 && response.data?.status && response.data?.nome) {
        return response.data;
      }

      if (response.status === 404 && response.data?.message === 'not in cache') {
        throw new Error('NOT_IN_CACHE');
      }

      if (response.status === 429) {
        throw new Error('MAX_RETRIES_EXCEEDED');
      }

      throw new Error('INVALID_API_RESPONSE');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      console.error(`[ReceitaWS] Erro tentativa ${attempt + 1} | Status: ${status} | Message: ${message}`);

      if (status === 404 && message === 'not in cache') throw new Error('NOT_IN_CACHE');
      if (status === 429) throw new Error('MAX_RETRIES_EXCEEDED');

      if (attempt === maxRetries - 1) throw new Error('API_ERROR');

      await sleep(delayMs);
    }
  }
}

// 🔍 Consulta CNPJ (com cache + retry)
async function consultarCNPJService(cnpj, cpf) {
  const consultaExistente = await prisma.consulta.findFirst({ where: { cpf, cnpj } });
  let dadosCNPJ = await prisma.dadosCNPJ.findUnique({ where: { cnpj } });
  let novaConsulta = consultaExistente;
  let consultado = true;

  if (!dadosCNPJ) {
    console.log(`[ReceitaWS] Cache não encontrado para CNPJ ${cnpj}`);
    let empresa;

    try {
      empresa = await consultarReceitaWSComRetry(cnpj);

      if (!empresa?.status || !empresa?.nome) throw new Error('INVALID_API_RESPONSE');
    } catch (error) {
      const message = error.message;

      if (message === 'NOT_IN_CACHE') throw { status: 404, message: 'Ainda não temos informações sobre este CNPJ.' };
      if (message === 'MAX_RETRIES_EXCEEDED') throw { status: 429, message: 'Limite de consultas atingido. Tente novamente em breve!' };
      if (message === 'INVALID_API_RESPONSE') throw { status: 502, message: 'Resposta inválida da ReceitaWS.' };
      if (message === 'API_ERROR') throw { status: 500, message: 'Erro ao consultar dados da ReceitaWS.' };

      if (!consultaExistente) {
        try {
          novaConsulta = await prisma.consulta.create({
            data: {
              nome: 'Empresa não identificada',
              cpf,
              cnpj,
              status: 'Pendente'
            }
          });

          await prisma.consulta.update({
            where: { id: novaConsulta.id },
            data: { status: 'Erro' }
          });

          novaConsulta.status = 'Erro';
        } catch (updateErr) {
          console.error(`[ReceitaWS] Erro ao criar/atualizar consulta para 'Erro':`, updateErr);
        }
      }

      throw { status: 500, message: 'Erro inesperado ao consultar dados da ReceitaWS.' };
    }

    dadosCNPJ = await prisma.dadosCNPJ.create({
      data: { cnpj, dados: empresa }
    });

    console.log(`[ReceitaWS] Cache criado para CNPJ ${cnpj}`);
  }

  if (!consultaExistente) {
    const dadosEmpresa = dadosCNPJ?.dados;

    if (!dadosEmpresa || (!dadosEmpresa.nome && !dadosEmpresa.fantasia)) {
      throw { status: 500, message: 'Erro ao consultar dados da ReceitaWS.' };
    }

    novaConsulta = await prisma.consulta.create({
      data: {
        nome: dadosEmpresa.nome || dadosEmpresa.fantasia || 'Empresa não identificada',
        cpf,
        cnpj,
        status: 'Pendente'
      }
    });
    consultado = false;
  }

  if (novaConsulta.status === 'Pendente') {
    await prisma.consulta.update({
      where: { id: novaConsulta.id },
      data: { status: 'Consultado' }
    });

    novaConsulta.status = 'Consultado';
  }

  return {
    consultado,
    consulta: {
      id: novaConsulta.id,
      cpf: novaConsulta.cpf,
      cnpj: novaConsulta.cnpj,
      status: novaConsulta.status,
      criadoEm: novaConsulta.criadoEm
    },
    empresa: dadosCNPJ.dados
  };
}

// 📋 Lista de consultas com filtros
async function listarConsultasService(cpf, email, nome, filtros = {}) {
  const {
    page = 1,
    limit = 5,
    status,
    data,
    nome: filtroNome,
    cnpj
  } = filtros;

  const where = { cpf };

  if (status) where.status = status.toLowerCase();

  if (data) {
    const start = new Date(`${data}T00:00:00.000Z`);
    const end = new Date(`${data}T23:59:59.999Z`);
    where.criadoEm = { gte: start, lte: end };
  }

  if (filtroNome) where.nome = { contains: filtroNome };
  if (cnpj) where.cnpj = { contains: cnpj.replace(/[^\d]+/g, '') };

  const total = await prisma.consulta.count({ where });

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
      criadoEm: true
    }
  });

  return {
    usuario: { cpf, email, nome },
    total,
    resultados: consultas.map((c) => ({
      ...c,
      criadoFormatado: new Date(c.criadoEm).toLocaleString('pt-BR')
    }))
  };
}

module.exports = {
  consultarCNPJService,
  listarConsultasService
};
