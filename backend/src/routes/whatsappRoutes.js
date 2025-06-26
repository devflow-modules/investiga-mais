const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const verifyToken = require('../middleware/auth');

// Logger
router.use((req, res, next) => {
  console.log(`[WhatsappRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// Webhook da Meta 
router.post('/webhook', whatsappController.receberMensagemWebhook);

// Rotas protegidas por token
router.use(verifyToken);

router.post('/enviar', whatsappController.enviarMensagem);

module.exports = router;
