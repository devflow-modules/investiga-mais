jest.mock('../../src/lib/prisma', () => require('../__mocks__/prisma'));

const prisma = require('../../src/lib/prisma');
const service = require('../../src/services/atribuirService');

describe('atribuirService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('atribuirConversa deve atribuir se estiver livre', async () => {
    prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: null });
    prisma.conversa.update.mockResolvedValue({});

    const result = await service.atribuirConversa(1, 999);
    expect(result).toEqual({ sucesso: true, mensagem: 'Conversa atribuída com sucesso.' });
  });

  test('atribuirConversa deve falhar se conversa não existir', async () => {
    prisma.conversa.findUnique.mockResolvedValue(null);
    await expect(service.atribuirConversa(999, 1)).rejects.toThrow('Conversa não encontrada.');
  });

  test('atribuirConversa deve falhar se conversa já for de outro atendente', async () => {
    prisma.conversa.findUnique.mockResolvedValue({ id: 2, atendenteId: 42 });
    await expect(service.atribuirConversa(2, 99)).rejects.toThrow('Conversa já atribuída a outro atendente.');
  });

  test('liberarConversa deve liberar se atendente for o mesmo', async () => {
    prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 888 });
    prisma.conversa.update.mockResolvedValue({});

    const result = await service.liberarConversa(1, 888);
    expect(result).toEqual({ sucesso: true, mensagem: 'Conversa liberada com sucesso.' });
  });

  test('liberarConversa deve falhar se conversa não existir', async () => {
    prisma.conversa.findUnique.mockResolvedValue(null);
    await expect(service.liberarConversa(123, 1)).rejects.toThrow('Conversa não encontrada.');
  });

  test('liberarConversa deve falhar se atendente for diferente', async () => {
    prisma.conversa.findUnique.mockResolvedValue({ id: 1, atendenteId: 50 });
    await expect(service.liberarConversa(1, 999)).rejects.toThrow('Você não pode liberar uma conversa que não está atendendo.');
  });

  test('liberarConversasInativas deve liberar todas', async () => {
    prisma.conversa.findMany.mockResolvedValue([{ id: 101 }, { id: 102 }]);
    prisma.conversa.updateMany.mockResolvedValue({});

    const result = await service.liberarConversasInativas();
    expect(result).toEqual({ sucesso: true, liberadas: 2 });
  });

  test('liberarConversasInativas deve retornar 0 se nenhuma conversa inativa', async () => {
    prisma.conversa.findMany.mockResolvedValue([]);
    const result = await service.liberarConversasInativas();
    expect(result).toEqual({ sucesso: true, liberadas: 0 });
  });

  test('atribuirConversaDisponivel deve atribuir conversa disponível ao atendente', async () => {
    prisma.conversa.findFirst.mockResolvedValue({ id: 10 });
    prisma.conversa.update.mockResolvedValue({});

    const result = await service.atribuirConversaDisponivel(123);
    expect(result).toEqual({ id: 10 });
    expect(prisma.conversa.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        atendenteId: 123,
        atendidaPorAutomacao: false,
      }),
    }));
  });

  test('atribuirConversaDisponivel deve retornar null se nenhuma conversa estiver disponível', async () => {
    prisma.conversa.findFirst.mockResolvedValue(null);
    const result = await service.atribuirConversaDisponivel(123);
    expect(result).toBeNull();
  });
});
