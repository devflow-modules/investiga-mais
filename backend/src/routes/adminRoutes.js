const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const verificarCron = require('../middleware/verificarCron');
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

// ROTAS
router.post('/registrar-manual', adminController.registrarManual)
router.get('/conversas', adminController.listarConversas)
router.get('/conversas/:id/mensagens', adminController.listarMensagensDaConversa)
router.post('/conversas/:id/responder', adminController.responderConversa)
router.post('/conversas/:id/atribuir', adminController.atribuirConversa)
router.post('/conversas/:id/liberar', adminController.liberarConversa)
router.post('/admin/liberar-inativas', verificarCron, adminController.liberarConversasInativas);

module.exports = router
