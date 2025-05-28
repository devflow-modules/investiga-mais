require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite por IP
});
app.use(limiter);

// Rotas
const rotaConsulta = require('./routes/consulta');
const rotaAuth = require('./routes/auth');
const rotaCNPJ = require('./routes/cnpj');
const verifyToken = require('./middleware/auth');

app.get('/', (req, res) => {
  res.send('🔐 API Investiga Mais com autenticação JWT');
});

app.use('/auth', rotaAuth);
app.use('/consulta', verifyToken, rotaConsulta);
app.use('/cnpj', rotaCNPJ);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Erros não tratados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro inesperado não tratado:', err);
});
