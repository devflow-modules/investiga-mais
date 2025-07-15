require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { errorHandler, loginLimiter, logger } = require('./middleware/index.js');
const authRoutes = require('./routes/authRoutes.js');
const webhookRoutes = require('./routes/webhookRoutes.js');
const consultaRoutes = require('./routes/consultaRoutes.js');
const perfilRoutes = require('./routes/perfilRoutes.js');
const segurancaRoutes = require('./routes/segurancaRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const whatsappRoutes = require('./routes/whatsappRoutes.js');

const { sendError } = require('./utils/sendResponse.js');

const app = express();

app.set('etag', false);
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('🔐 API Investiga Mais com autenticação JWT');
});

app.use(logger);

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);

app.use('/api/consulta', consultaRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/seguranca', segurancaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use((req, res) => {
  return sendError(res, 404, 'Rota não encontrada');
});

app.use(errorHandler);

module.exports = app;
