const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const authController = require('../controllers/authController');
const recuperacaoController = require('../controllers/recuperacaoController');

// 🔐 Login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// 🔁 Recuperação de senha
router.post('/recuperar', recuperacaoController.recuperarSenha);
router.post('/resetar-senha', recuperacaoController.resetarSenha);

// ✅ Rota de verificação de autenticação (protegida)
router.get('/verify', verifyToken, (req, res) => {
  return res.status(200).json({ sucesso: true });
});

module.exports = router;
