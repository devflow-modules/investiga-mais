import prisma from '../lib/prisma.js';
import { erroComStatus } from '../utils/erroComStatus.js';
import { validarEmail, validarCPF, campoObrigatorio } from '../utils/validarInput.js';

export async function registrarManualService({ email, cpf, nome, telefone, token }) {
  // Validações obrigatórias
  if (!email || !validarEmail(email)) throw erroComStatus(400, 'Email inválido.');
  if (!cpf || !validarCPF(cpf)) throw erroComStatus(400, 'CPF inválido.');
  campoObrigatorio(nome, 'Nome');
  campoObrigatorio(telefone, 'Telefone');

  try {
    const usuario = await prisma.usuario.create({
      data: {
        email,
        cpf,
        nome,
        telefone,
        criadoViaAdmin: true
      }
    });

    return { usuario };
  } catch (err) {
    if (err.code === 'P2002') {
      // Erro de único Prisma
      const campo = err.meta?.target?.[0] || 'campo único';
      throw erroComStatus(409, `O ${campo} informado já está em uso.`);
    }

    throw erroComStatus(500, 'Erro ao registrar usuário.');
  }
}
