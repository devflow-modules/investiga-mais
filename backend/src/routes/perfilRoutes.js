const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const limiterPerfil = require('../middleware/limiterPerfil')
const perfilController = require('../controllers/perfilController')

// Logger
router.use((req, res, next) => {
  console.log(`[PerfilRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body)
  next()
})

// GET /perfil → obter perfil
router.get('/', verifyToken, perfilController.obterPerfil)

// POST /perfil → atualizar perfil (com limiter para evitar spam)
router.post('/', verifyToken, limiterPerfil, perfilController.atualizarPerfil)

module.exports = router
