const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const segurancaController = require('../controllers/segurancaController')

// Logger
router.use((req, res, next) => {
    console.log(`[SegurancaRoutes] ${req.method} ${req.originalUrl} - Params:`, req.params, 'Query:', req.query, 'Body:', req.body)
    next()
})

// Protege todas as rotas
router.use(verifyToken)

// IP Check
router.get('/ip-check', segurancaController.ipCheck)

// Email Verification
router.get('/email-verify/:email', segurancaController.emailVerify)

// Safe Browsing URL Check
router.get('/safe-browsing-check', segurancaController.safeBrowsingCheck)

module.exports = router
