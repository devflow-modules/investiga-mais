const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const somenteRoles = require('../middleware/somenteRoles')
const Roles = require('../utils/roles')

const limiterPerfil = require('../middleware/limiterPerfil')
const perfilController = require('../controllers/perfilController')

// Logger
router.use((req, res, next) => {
  console.log(`[PerfilRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body)
  next()
})

// Protege todas as rotas → CLIENTE
router.use(verifyToken)
router.use(somenteRoles([Roles.CLIENTE]))

router.get('/', perfilController.obterPerfil)
router.post('/', limiterPerfil, perfilController.atualizarPerfil)

module.exports = router
