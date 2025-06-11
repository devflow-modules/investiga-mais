const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const somenteRoles = require('../middleware/somenteRoles')
const Roles = require('../utils/roles')

const segurancaController = require('../controllers/segurancaController')

// Logger
router.use((req, res, next) => {
  console.log(`[SegurancaRoutes] ${req.method} ${req.originalUrl} - Params:`, req.params, 'Query:', req.query, 'Body:', req.body)
  next()
})

// Protege todas as rotas → CLIENTE
router.use(verifyToken)
router.use(somenteRoles([Roles.CLIENTE]))

router.get('/ip-check', segurancaController.ipCheck)
router.get('/email-verify/:email', segurancaController.emailVerify)
router.get('/safe-browsing', segurancaController.safeBrowsingCheck)

module.exports = router
