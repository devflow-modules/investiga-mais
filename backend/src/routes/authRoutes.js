const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const authController = require('../controllers/authController');
const recuperacaoController = require('../controllers/recuperacaoController');

// ✅ Verificação de autenticação (usada no hook useAuth)
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    autenticado: true,
    usuario: req.user,
  });
});

// 🔐 Login
router.post('/login', authController.login);

// 🔓 Logout
router.get('/logout', authController.logout);

// 🔁 Recuperação de senha
router.post('/recuperar', recuperacaoController.recuperarSenha);
router.post('/resetar-senha', recuperacaoController.resetarSenha);

module.exports = router;
