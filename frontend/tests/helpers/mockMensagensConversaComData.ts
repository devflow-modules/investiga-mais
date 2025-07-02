import type { Mensagem, Options } from '@types'

export function mockMensagensConversaComData(datas: string[], options?: Options) {
  const mensagens: Mensagem[] = datas.map((dataStr, index) => ({
    id: index + 1,
    conteudo: `Mensagem ${index + 1}`,
    direcao: 'entrada',
    timestamp: new Date(dataStr).toISOString()
  }))

  jest.mock('@/hooks/useMensagensConversa', () => ({
    useMensagensConversa: () => ({
      mensagens,
      setMensagens: jest.fn(),
      carregarMais: jest.fn(),
      hasMore: options?.hasMore ?? false,
      loading: options?.loading ?? false
    })
  }))
}
