const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/webhookController.js');
const { verificarKirvanoWebhookSecret } = require('../middleware/kirvanoWebhookAuth.js');

// ✅ Rota POST para confirmação de compra (shared-secret auth)
router.post(
  '/compra-confirmada',
  verificarKirvanoWebhookSecret,
  webhookController.registrarViaCompra
);

module.exports = router;
