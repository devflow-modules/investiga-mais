const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const senhaPlana = 'Senha1234@';
  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  console.log('Hash gerada para senha padrão:', senhaHash);

  // Admin
  await prisma.usuario.upsert({
    where: { email: 'admin@investiga.com' },
    update: {},
    create: {
      email: 'admin@investiga.com',
      senha: senhaHash,
      cpf: '00000000001',
      nome: 'Admin Master',
      role: 'admin',
    },
  });

  // Operador 1
  await prisma.usuario.upsert({
    where: { email: 'operador1@investiga.com' },
    update: {},
    create: {
      email: 'operador1@investiga.com',
      senha: senhaHash,
      cpf: '00000000002',
      nome: 'Operador Um',
      role: 'operador',
    },
  });

  // Operador 2
  await prisma.usuario.upsert({
    where: { email: 'operador2@investiga.com' },
    update: {},
    create: {
      email: 'operador2@investiga.com',
      senha: senhaHash,
      cpf: '00000000003',
      nome: 'Operador Dois',
      role: 'operador',
    },
  });

  console.log('✅ Usuários de seed criados com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
