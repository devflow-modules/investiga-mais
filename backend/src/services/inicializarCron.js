const { liberarConversasInativas } = require('./liberarConversasInativas')

function iniciarVerificadorDeConversas() {
  console.log('⏰ Cron de verificação de conversas inativas iniciado (1min)')
  setInterval(() => {
    liberarConversasInativas().catch((err) =>
      console.error('[Cron Error]', err)
    )
  }, 60 * 1000)
}

module.exports = { iniciarVerificadorDeConversas }
