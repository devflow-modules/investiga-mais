const { liberarConversasInativas } = require('./adminService.js');

function iniciarVerificadorDeConversas() {
  setInterval(async () => {
    try {
      await liberarConversasInativas();
    } catch (err) {
      console.error('❌ Erro no verificador de conversas inativas:', err);
    }
  }, 60 * 1000);
}

module.exports = {
  iniciarVerificadorDeConversas
};
