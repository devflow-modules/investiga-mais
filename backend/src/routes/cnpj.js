const express = require('express')
const axios = require('axios')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const somenteRoles = require('../middleware/somenteRoles')
const Roles = require('../utils/roles')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const EXPIRACAO_MS = 7 * 24 * 60 * 60 * 1000
const API_FALLBACK = 'https://publica.cnpj.ws/cnpj'

// Protege todas as rotas → OPERADOR
router.use(verifyToken)
router.use(somenteRoles([Roles.OPERADOR]))

router.get('/:cnpj', async (req, res) => {
  const { cnpj } = req.params
  try {
    const cache = await prisma.dadosCNPJ.findUnique({ where: { cnpj } })
    const agora = new Date()
    const expirado = cache && new Date(cache.criadoEm).getTime() < agora.getTime() - EXPIRACAO_MS

    if (cache && !expirado) {
      return res.json({ sucesso: true, origem: 'cache', dados: cache.dados })
    }

    let data = null
    let origem = ''

    try {
      const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`)
      data = response.data
      origem = 'api_receitaws'
    } catch {
      const fallbackRes = await axios.get(`${API_FALLBACK}/${cnpj}`)
      data = fallbackRes.data
      origem = 'api_fallback'
    }

    if (cache) {
      await prisma.dadosCNPJ.update({
        where: { cnpj },
        data: {
          dados: data,
          criadoEm: new Date()
        }
      })
    } else {
      await prisma.dadosCNPJ.create({
        data: {
          cnpj,
          dados: data
        }
      })
    }

    return res.json({ sucesso: true, origem, dados: data })

  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar dados do CNPJ em ambas as APIs.' })
  }
})

module.exports = router
