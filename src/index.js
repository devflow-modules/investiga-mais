// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rota simples
app.get('/', (req, res) => {
  res.send('🚀 Investiga Mais API rodando com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});