const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.consultarCNPJ = async (req, res) => {
  const { cnpj } = req.params
  const user = req.user // JWT decodificado (via middleware auth)

  try {
    const consulta = await prisma.consulta.findFirst({
      where: {
        cpf: user.cpf,
        cnpj: cnpj
      }
    })

    if (!consulta) {
      return res.status(404).json({ sucesso: false, mensagem: 'Consulta não encontrada.' })
    }

    return res.json({ sucesso: true, dados: consulta })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao consultar CNPJ.' })
  }
}

exports.criarConsulta = async (req, res) => {
  const { nome, cnpj, status } = req.body
  const user = req.user

  if (!nome || !cnpj || !status) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, cnpj, status' })
  }

  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        nome,
        cpf: user.cpf,
        cnpj,
        status
      }
    })

    return res.status(201).json({ sucesso: true, dados: novaConsulta })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao criar consulta.' })
  }
}

exports.listarConsultas = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const user = req.user

  try {
    const [total, consultas] = await Promise.all([
      prisma.consulta.count({ where: { cpf: user.cpf } }),
      prisma.consulta.findMany({
        where: { cpf: user.cpf },
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' }
      })
    ])

    return res.json({
      sucesso: true,
      total,
      page,
      limit,
      resultados: consultas
    })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar consultas.' })
  }
}
