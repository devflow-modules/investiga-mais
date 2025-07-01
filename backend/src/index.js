const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Inicia verificação automática de conversas inativas
const { iniciarVerificadorDeConversas } = require('./services/inicializarCron');
iniciarVerificadorDeConversas();

// Erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro inesperado não tratado:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejeição não tratada:', reason);
});
