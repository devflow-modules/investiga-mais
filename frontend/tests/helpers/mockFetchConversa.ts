export function mockFetchConversa(conversasPersonalizadas = [
  {
    id: 1,
    nome: 'Usuário Teste',
    numero: '+5511999999999',
    ultimaMensagem: 'Olá!',
    ultimaMensagemEm: new Date().toISOString(),
    atendenteId: null
  }
]) {
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes('/api/admin/conversas')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            conversas: conversasPersonalizadas
          }
        })
      })
    }

    return Promise.resolve({
      ok: true,
      json: () => ({ success: true })
    })
  })
}
