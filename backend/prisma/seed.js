require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

async function main() {
  console.log('🌱 Iniciando seed...');

  const senhaPadrao = '@Nexus0001';
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  // === ADMINS ===
  const admins = [
    {
      email: 'admin@investigamais.com',
      nome: 'Admin Master',
      telefone: '13999999999',
      cpf: '00000000000',
      nascimento: new Date('1990-01-01'),
      cidade: 'Santos',
      uf: 'SP',
      genero: 'Masculino'
    },
    {
      email: 'admin2@investigamais.com',
      nome: 'Admin Suporte',
      telefone: '11999998888',
      cpf: '99999999999',
      nascimento: new Date('1991-05-15'),
      cidade: 'Campinas',
      uf: 'SP',
      genero: 'Feminino'
    }
  ];

  for (const admin of admins) {
    const existente = await prisma.usuario.findUnique({ where: { email: admin.email } });
    if (!existente) {
      await prisma.usuario.create({
        data: {
          ...admin,
          senha: senhaHash,
          role: 'admin'
        }
      });
      console.log(`✅ Admin criado: ${admin.email}`);
    } else {
      console.log(`ℹ️ Admin já existe: ${admin.email}`);
    }
  }

  // === CLIENTES ===
  const clientes = [
    {
      email: 'cliente1@teste.com',
      cpf: '11111111111',
      nome: 'Maria Souza',
      telefone: '11988887777',
      nascimento: new Date('1985-03-22'),
      cidade: 'São Paulo',
      uf: 'SP',
      genero: 'Feminino'
    },
    {
      email: 'cliente2@teste.com',
      cpf: '22222222222',
      nome: 'João Pereira',
      telefone: '21999996666',
      nascimento: new Date('1992-07-10'),
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      genero: 'Masculino'
    }
  ];

  for (const cliente of clientes) {
    const existe = await prisma.usuario.findUnique({ where: { email: cliente.email } });
    if (!existe) {
      await prisma.usuario.create({
        data: {
          ...cliente,
          senha: senhaHash,
          role: 'cliente'
        }
      });
      console.log(`✅ Cliente criado: ${cliente.email}`);
    } else {
      console.log(`ℹ️ Cliente já existe: ${cliente.email}`);
    }
  }

  // === CONVERSA SIMULADA ===
  const conversa = await prisma.conversa.create({
    data: {
      numero: '5599999999999',
      nome: 'Teste WhatsApp',
      mensagens: {
        create: [
          {
            direcao: 'entrada',
            conteudo: 'Olá, gostaria de saber mais.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: 'lida'
          },
          {
            direcao: 'saida',
            conteudo: 'Claro! Posso te ajudar.',
            timestamp: new Date(),
            status: 'entregue',
            Atendente: { connect: { email: 'admin@investigamais.com' } }
          }
        ]
      }
    }
  });

  console.log(`💬 Conversa simulada criada (ID: ${conversa.id})`);

  // === CONSULTA SIMULADA ===
  await prisma.consulta.create({
    data: {
      nome: 'Empresa Exemplo LTDA',
      cpf: '12345678901',
      cnpj: '19131243000197',
      status: 'Sucesso'
    }
  });

  console.log('🔍 Consulta simulada criada.');

  // === TOKEN DE RECUPERAÇÃO ===
  const admin = await prisma.usuario.findUnique({ where: { email: 'admin@investigamais.com' } });
  await prisma.tokenRecuperacao.create({
    data: {
      token: 'token-exemplo-123456',
      usuarioId: admin.id,
      expiracao: new Date(Date.now() + 1000 * 60 * 60)
    }
  });

  console.log('🔑 Token de recuperação gerado para admin.');
  console.log('🎯 Seed finalizada com sucesso.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erro ao executar seed:', err);
    process.exit(1);
  });
