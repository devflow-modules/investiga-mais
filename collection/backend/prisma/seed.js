const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10);

  await prisma.usuario.create({
    data: {
      email: 'admin@teste.com',
      senha: senhaHash,
    },
  });

  console.log('Usuário seed criado com sucesso.');
}

main().finally(() => prisma.$disconnect());