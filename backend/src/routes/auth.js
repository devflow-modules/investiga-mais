const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const recuperacaoController = require('../controllers/recuperacaoController');

// Rota para login e registro de usuários 
router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.post('/recuperar', recuperacaoController.recuperarSenha);
router.post('/resetar-senha', recuperacaoController.resetarSenha);

module.exports = router;
