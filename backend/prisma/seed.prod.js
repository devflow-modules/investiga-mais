require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

async function main() {
  console.log('🌱 Iniciando seed de produção...');

  const senhaPadrao = process.env.SENHA_SEED_ADMIN || '@SenhaSegura123';
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  // === ADMIN MASTER ===
  const emailAdmin = process.env.EMAIL_ADMIN || 'admin@investigamais.com';

  const adminExistente = await prisma.usuario.findUnique({
    where: { email: emailAdmin }
  });

  if (!adminExistente) {
    await prisma.usuario.create({
      data: {
        email: emailAdmin,
        senha: senhaHash,
        nome: 'Admin Geral (Gustavo)',
        cpf: '00000000000',
        telefone: '13991729587',
        nascimento: new Date('2000-05-09'),
        cidade: 'Santos',
        uf: 'SP',
        genero: 'Masculino',
        role: 'admin'
      }
    });

    console.log(`✅ Admin criado: ${emailAdmin}`);
  } else {
    console.log(`ℹ️ Admin já existe: ${emailAdmin}`);
  }

  console.log('🎯 Seed de produção finalizado com sucesso.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erro ao executar seed:', err);
    process.exit(1);
  });
