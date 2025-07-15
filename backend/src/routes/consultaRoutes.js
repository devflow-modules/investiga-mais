const express = require('express');
const verifyToken = require('../middleware/auth.js');
const somenteRoles = require('../middleware/somenteRoles.js');
const Roles = require('../utils/roles.js');
const consultaController = require('../controllers/consultaController.js');

const router = express.Router();

// Protege todas as rotas da consulta
router.use(verifyToken);
router.use(somenteRoles([Roles.CLIENTE]));

// Rota para consultar CNPJ
router.get('/:cnpj', consultaController.consultarCNPJ);

// Rota para listar histórico de consultas
router.get('/', consultaController.listarConsultas);

module.exports = router;
