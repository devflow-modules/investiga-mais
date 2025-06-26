require('dotenv').config();

const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

async function main() {
  const senhaPadrao = '@Nexus0001';
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  // Criação do admin
  const emailAdmin = 'admin@investigamais.com';
  const adminExistente = await prisma.usuario.findUnique({ where: { email: emailAdmin } });
  if (!adminExistente) {
    const admin = await prisma.usuario.create({
      data: {
        email: emailAdmin,
        senhaHash,
        cpf: '00000000000',
        nome: 'Admin Master',
        telefone: '13999999999',
        nascimento: new Date('1990-01-01'),
        cidade: 'Santos',
        uf: 'SP',
        genero: 'Masculino',
        role: 'admin',
      },
    });
    console.log(`✅ Admin criado: ${admin.email}`);
  } else {
    console.log(`ℹ️ Admin já existe: ${emailAdmin}`);
  }

  // Criação de usuários clientes
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
          senhaHash,
          role: 'cliente'
        }
      });
      console.log(`✅ Cliente criado: ${cliente.email}`);
    } else {
      console.log(`ℹ️ Cliente já existe: ${cliente.email}`);
    }
  }

  // Conversa com mensagens simuladas
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
            Atendente: { connect: { email: emailAdmin } }
          }
        ]
      }
    }
  });

  console.log(`💬 Conversa criada com ID ${conversa.id}`);

  // Consulta simulada
  await prisma.consulta.create({
    data: {
      nome: 'Empresa Exemplo LTDA',
      cpf: '12345678901',
      cnpj: '19131243000197',
      status: 'Sucesso'
    }
  });

  // Token de recuperação para admin (expira em 1h)
  const admin = await prisma.usuario.findUnique({ where: { email: emailAdmin } });
  await prisma.tokenRecuperacao.create({
    data: {
      token: 'token-exemplo-123456',
      usuarioId: admin.id,
      expiracao: new Date(Date.now() + 1000 * 60 * 60)
    }
  });

  console.log('🎯 Seed finalizada com dados completos.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erro ao executar seed:', err);
    process.exit(1);
  });
