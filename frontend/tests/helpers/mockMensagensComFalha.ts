import type { Mensagem } from '@types'

export function mockMensagensComFalha(overrides?: Partial<Mensagem>[]) {
  const mensagens: Mensagem[] = (overrides?.length ? overrides : [
    {
      id: 1,
      conteudo: 'Falhou ao enviar',
      direcao: 'saida',
      status: 'falhou',
      timestamp: new Date().toISOString()
    }
  ]) as Mensagem[]

  jest.mock('@/hooks/useMensagensConversa', () => ({
    useMensagensConversa: () => ({
      mensagens,
      setMensagens: jest.fn(),
      carregarMais: jest.fn(),
      hasMore: false,
      loading: false
    })
  }))
}
