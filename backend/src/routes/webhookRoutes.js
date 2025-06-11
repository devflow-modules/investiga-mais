const express = require('express')
const router = express.Router()
const { registrarViaCompra } = require('../controllers/webhookController')

// ✅ Rota POST para confirmação de compra
router.post('/compra-confirmada', registrarViaCompra)

module.exports = router
