const post = jest.fn().mockImplementation((url, body) => {
  if (body.mensagem === 'erro') {
    throw new Error('Falha simulada');
  }
  return Promise.resolve({ data: { ok: true } });
});

module.exports = {
  post,
};
