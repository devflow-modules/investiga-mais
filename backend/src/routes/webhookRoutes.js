const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/webhookController.js');

// ✅ Rota POST para confirmação de compra
router.post('/compra-confirmada', webhookController.registrarViaCompra);

module.exports = router;
