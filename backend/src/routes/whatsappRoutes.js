const express = require('express');
const router = express.Router();

const whatsappController = require('../controllers/whatsappController.js');
const verifyToken = require('../middleware/auth.js');

// 📋 Logger de requisições
router.use((req, res, next) => {
  console.log(`[WhatsappRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// 📩 Webhook da Meta (sem autenticação)
router.post('/webhook', whatsappController.receberMensagemWebhook);

// 🔐 Rotas protegidas por token
router.use(verifyToken);

// 📤 Enviar mensagem via WhatsApp
router.post('/enviar', whatsappController.enviarMensagem);

module.exports = router;
