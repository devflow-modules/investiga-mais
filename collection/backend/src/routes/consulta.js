const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const verifyToken = require('../middleware/auth'); // ou verifyToken.js

router.get('/consulta/:cnpj', verifyToken, consultaController.consultarCNPJ);
router.post('/consulta', verifyToken, consultaController.criarConsulta);
router.get('/consulta', verifyToken, consultaController.listarConsultas);

module.exports = router;