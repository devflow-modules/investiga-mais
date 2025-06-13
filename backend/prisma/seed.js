require('dotenv').config()

const bcrypt = require('bcryptjs')
const prisma = require('../src/lib/prisma')

async function main() {
  const senhaAdmin = '@Nexus0001'
  const senhaHash = await bcrypt.hash(senhaAdmin, 10)

  const emailAdmin = 'admin@investigamais.com'

  // Verifica se já existe
  const adminExistente = await prisma.usuario.findUnique({
    where: { email: emailAdmin },
  })

  if (adminExistente) {
    console.log(`✅ Admin já existe: ${emailAdmin} (id: ${adminExistente.id})`)
    return
  }

  // Cria admin
  const novoAdmin = await prisma.usuario.create({
    data: {
      email: emailAdmin,
      senhaHash: senhaHash,
      cpf: '00000000000',
      nome: 'Admin Master',
      telefone: '13999999999',
      nascimento: new Date('1990-01-01'),
      cidade: 'Santos',
      uf: 'SP',
      genero: 'Masculino',
      role: 'admin',
    },
  })

  console.log(`🎉 Admin criado com sucesso: ${novoAdmin.email} (id: ${novoAdmin.id})`)
}

main()
  .then(() => {
    console.log('✅ Seed finalizado')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Erro no seed:', err)
    process.exit(1)
  })