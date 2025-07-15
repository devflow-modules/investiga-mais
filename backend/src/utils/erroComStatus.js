function erroComStatus(status = 400, mensagem = 'Erro') {
  const err = new Error(mensagem);
  err.status = status;
  throw err;
}

module.exports = erroComStatus;