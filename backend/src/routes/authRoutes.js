const express = require('express');
const verifyToken = require('../middleware/auth.js');
const authController = require('../controllers/authController.js');
const recuperacaoController = require('../controllers/recuperacaoController.js');
const { sendSuccess } = require('../utils/sendResponse.js');

const router = express.Router();

// ✅ Verificação de autenticação (usada no hook useAuth)
router.get('/verify', verifyToken, (req, res) => {
  return sendSuccess(res, {
    usuario: req.user
  }, 'Usuário autenticado');
});

// 🔐 Login
router.post('/login', authController.login);

// 🔓 Logout
router.get('/logout', authController.logout);

// 🔁 Recuperação de senha
router.post('/recuperar', recuperacaoController.recuperarSenha);
router.post('/resetar-senha', recuperacaoController.resetarSenha);

module.exports = router;
