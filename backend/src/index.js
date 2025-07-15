const app = require('./app.js');
const { iniciarVerificadorDeConversas } = require('./services/cronService.js');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  iniciarVerificadorDeConversas();
});
