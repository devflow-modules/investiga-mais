const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const somenteRoles = require('../middleware/somenteRoles')
const Roles = require('../utils/roles')

const consultaController = require('../controllers/consultaController')

// Protege todas as rotas
router.use(verifyToken)
router.use(somenteRoles([Roles.CLIENTE]))

router.get('/:cnpj', consultaController.consultarCNPJ)
router.get('/', consultaController.listarConsultas)

module.exports = router
