require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())

// 🔥 CORS ajustado para aceitar frontend em localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(cookieParser())

// Middlewares (importados via index.js)
const {
  verifyToken,
  errorHandler,
  limiterPerfil,
  loginLimiter,
  logger
} = require('./middleware')


// Rotas
const authRoutes = require('./routes/authRoutes')
const cnpjRoutes = require('./routes/cnpj')
const webhookRoutes = require('./routes/webhookRoutes')
const consultaRoutes = require('./routes/consultaRoutes')
const perfilRoutes = require('./routes/perfilRoutes')

// Rota de teste
app.get('/', (req, res) => {
  res.send('🔐 API Investiga Mais com autenticação JWT')
})

app.use(logger) // 👈 aplica o logger aqui

// 🟢 Rotas públicas sob /api
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/cnpj', cnpjRoutes)
app.use('/api/webhook', webhookRoutes)

// 🟢 Rotas protegidas sob /api
app.use('/api/consulta', verifyToken, consultaRoutes)
app.use('/api/perfil', perfilRoutes)

// Fallback 404 → com padrão sendError
const { sendError } = require('../../shared/utils/sendResponse')
app.use((req, res) => {
  return sendError(res, 404, 'Rota não encontrada')
})

// Error handler global
app.use(errorHandler)

module.exports = app
