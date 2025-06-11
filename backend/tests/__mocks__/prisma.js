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
    count: jest.fn()
  },
  $disconnect: jest.fn(),
  $on: jest.fn(),
  $use: jest.fn(),
};

module.exports = prismaMock;
