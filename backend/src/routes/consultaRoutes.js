const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// ⚠️ NUNCA repetir "/consulta" aqui pois já está no app.js
router.get('/:cnpj', consultaController.consultarCNPJ);
router.get('/', consultaController.listarConsultas);

module.exports = router;