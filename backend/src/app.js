require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(cookieParser());

// Middlewares
const loginLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const verifyToken = require('./middleware/auth');

// Rotas públicas
const authRoutes = require('./routes/authRoutes');
const cnpjRoutes = require('./routes/cnpj');
const webhookRoutes = require('./routes/webhookRoutes');
const consultaRoutes = require('./routes/consultaRoutes');

app.get('/', (req, res) => {
  res.send('🔐 API Investiga Mais com autenticação JWT');
});

app.use('/auth/login', loginLimiter);
app.use('/auth', authRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/api', webhookRoutes);

// Rotas protegidas
app.use('/consulta', verifyToken, consultaRoutes);

// Fallback e erro
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});
app.use(errorHandler);

module.exports = app;
