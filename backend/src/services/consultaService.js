const axios = require('axios');
const prisma = require('../lib/prisma.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Per-CNPJ in-flight cache acquisitions (process-local single-flight). */
const inflightByCnpj = new Map();

/** Per (cpf,cnpj) in-flight Consulta ensure — avoids duplicate history rows after cache wait. */
const inflightConsultaByKey = new Map();

function getReceitaTimeoutMs() {
  const raw = Number(process.env.RECEITAWS_TIMEOUT_MS);
  if (Number.isFinite(raw) && raw > 0) {
    return Math.min(raw, 30_000);
  }
  return 5_000;
}

function isValidEmpresaPayload(dados) {
  return Boolean(dados && dados.status && (dados.nome || dados.fantasia));
}

function isUniqueCnpjConflict(err) {
  if (!err || err.code !== 'P2002') return false;
  const target = err.meta?.target;
  if (!target) {
    return /\bcnpj\b/i.test(String(err.message || ''));
  }
  const fields = Array.isArray(target) ? target : [target];
  return fields.some((field) => String(field).toLowerCase().includes('cnpj'));
}

// 🔁 Consulta com retry na ReceitaWS
async function consultarReceitaWSComRetry(cnpj) {
  const maxRetries = 3;
  const delayMs = 300;
  const timeout = getReceitaTimeoutMs();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    console.log(`[ReceitaWS] Tentativa ${attempt + 1} para CNPJ ${cnpj}`);

    try {
      const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`, {
        timeout
      });

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

async function fetchAndPersistEmpresa(cnpj) {
  const empresa = await consultarReceitaWSComRetry(cnpj);

  if (!isValidEmpresaPayload(empresa)) {
    throw new Error('INVALID_API_RESPONSE');
  }

  try {
    return await prisma.dadosCNPJ.create({
      data: { cnpj, dados: empresa }
    });
  } catch (err) {
    if (isUniqueCnpjConflict(err)) {
      const canonical = await prisma.dadosCNPJ.findUnique({ where: { cnpj } });
      if (canonical) return canonical;
    }
    throw err;
  }
}

/**
 * Acquire DadosCNPJ for a CNPJ with per-key single-flight.
 * Different CNPJs do not share the same inflight promise.
 */
async function acquireDadosCNPJ(cnpj) {
  let dadosCNPJ = await prisma.dadosCNPJ.findUnique({ where: { cnpj } });

  if (dadosCNPJ && !isValidEmpresaPayload(dadosCNPJ.dados)) {
    console.warn(`[ReceitaWS] Cache malformado para CNPJ ${cnpj} — invalidando`);
    try {
      await prisma.dadosCNPJ.delete({ where: { cnpj } });
    } catch (deleteErr) {
      console.error(`[ReceitaWS] Falha ao invalidar cache malformado:`, deleteErr.message);
    }
    dadosCNPJ = null;
  }

  if (dadosCNPJ) {
    return dadosCNPJ;
  }

  const existingInflight = inflightByCnpj.get(cnpj);
  if (existingInflight) {
    return existingInflight;
  }

  let settle;
  const acquisition = new Promise((resolve, reject) => {
    settle = { resolve, reject };
  });
  // Synchronous get→set: no await between miss and registration.
  inflightByCnpj.set(cnpj, acquisition);

  (async () => {
    try {
      const cached = await prisma.dadosCNPJ.findUnique({ where: { cnpj } });
      if (cached && isValidEmpresaPayload(cached.dados)) {
        settle.resolve(cached);
        return;
      }

      console.log(`[ReceitaWS] Cache não encontrado para CNPJ ${cnpj}`);
      const created = await fetchAndPersistEmpresa(cnpj);
      console.log(`[ReceitaWS] Cache criado para CNPJ ${cnpj}`);
      settle.resolve(created);
    } catch (err) {
      settle.reject(err);
    } finally {
      inflightByCnpj.delete(cnpj);
    }
  })();

  return acquisition;
}

async function ensureConsultaRecord(cnpj, cpf, dadosEmpresa) {
  const key = `${cpf}:${cnpj}`;

  let pending = inflightConsultaByKey.get(key);
  if (!pending) {
    let settle;
    pending = new Promise((resolve, reject) => {
      settle = { resolve, reject };
    });
    // Synchronous get→set: no await between miss and registration.
    inflightConsultaByKey.set(key, pending);

    (async () => {
      try {
        const raced = await prisma.consulta.findFirst({ where: { cpf, cnpj } });
        if (raced) {
          settle.resolve(raced);
          return;
        }

        const created = await prisma.consulta.create({
          data: {
            nome: dadosEmpresa.nome || dadosEmpresa.fantasia || 'Empresa não identificada',
            cpf,
            cnpj,
            status: 'Pendente'
          }
        });
        settle.resolve(created);
      } catch (err) {
        settle.reject(err);
      } finally {
        inflightConsultaByKey.delete(key);
      }
    })();
  }

  const consulta = await pending;
  return { consulta, created: true };
}

// 🔍 Consulta CNPJ (com cache + retry + single-flight)
async function consultarCNPJService(cnpj, cpf) {
  let consultaExistente = await prisma.consulta.findFirst({ where: { cpf, cnpj } });
  let novaConsulta = consultaExistente;
  let consultado = true;
  let dadosCNPJ;

  try {
    dadosCNPJ = await acquireDadosCNPJ(cnpj);
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

    throw {
      status: error.status || 500,
      message: message || 'Erro inesperado ao consultar dados da ReceitaWS.'
    };
  }

  if (!consultaExistente) {
    const dadosEmpresa = dadosCNPJ?.dados;

    if (!isValidEmpresaPayload(dadosEmpresa)) {
      throw { status: 500, message: 'Erro ao consultar dados da ReceitaWS.' };
    }

    const ensured = await ensureConsultaRecord(cnpj, cpf, dadosEmpresa);
    novaConsulta = ensured.consulta;
    consultado = !ensured.created;
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

function __resetInflightForTests() {
  inflightByCnpj.clear();
  inflightConsultaByKey.clear();
}

module.exports = {
  consultarCNPJService,
  listarConsultasService,
  isValidEmpresaPayload,
  isUniqueCnpjConflict,
  __resetInflightForTests
};
