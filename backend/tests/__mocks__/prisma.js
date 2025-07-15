const prismaMock = {
  dadosCNPJ: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  consulta: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  usuario: {
    findUnique: jest.fn(),
  },
  conversa: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findFirst: jest.fn(),
  },
  mensagem: {
    create: jest.fn(),
    update: jest.fn(),
  },
  $disconnect: jest.fn(),
  $on: jest.fn(),
  $use: jest.fn(),
};

module.exports = prismaMock;
