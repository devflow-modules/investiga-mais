const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const somenteRoles = require('../middleware/somenteRoles')
const Roles = require('../utils/roles')

const adminController = require('../controllers/adminController')

// Logger opcional
router.use((req, res, next) => {
  console.log(`[AdminRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body)
  next()
})

// Protege com verifyToken + somente ADMIN
router.use(verifyToken)
router.use(somenteRoles([Roles.ADMIN]))

// POST /api/admin/registrar-manual
router.post('/registrar-manual', adminController.registrarManual)

// GET /api/admin/conversas
router.get('/conversas', adminController.listarConversas)

// GET /api/admin/conversas/:id/mensagens
router.get('/conversas/:id/mensagens', adminController.listarMensagensDaConversa)

// POST /api/conversas/:id/responder
router.post('/conversas/:id/responder', adminController.responderConversa)

module.exports = router
