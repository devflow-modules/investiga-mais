const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => ({
            usuario: {
                findUnique: mockFindUnique,
                update: mockUpdate
            }
        }))
    };
});

// ✅ Mock do middleware de autenticação - com ROLE 'cliente'
jest.mock('../src/middleware/auth', () => (req, res, next) => {
    req.user = {
        usuarioId: 'mocked-usuario-id',
        cpf: '12345678900',
        email: 'teste@teste.com',
        nome: 'Usuário Teste',
        role: 'cliente' // 👈 ADICIONADO!
    };
    next();
});

// ✅ Mock do limiterPerfil para não dar 429
jest.mock('../src/middleware/limiterPerfil', () => (req, res, next) => next());

const request = require('supertest');
const app = require('../src/app');

describe('PerfilController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const endpointObter = '/api/perfil';
    const endpointAtualizar = '/api/perfil';

    it('retorna 404 se usuário não for encontrado em obterPerfil', async () => {
        mockFindUnique.mockResolvedValue(null);

        const res = await request(app).get(endpointObter);

        console.log('Response:', res.body);

        expect(res.statusCode).toBe(404);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/usuário não encontrado/i);
    });

    it('retorna perfil corretamente em obterPerfil', async () => {
        mockFindUnique.mockResolvedValue({
            email: 'teste@email.com',
            cpf: '12345678909',
            nome: 'joao da silva',
            telefone: '11999999999',
            nascimento: new Date('1990-01-01'),
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'M',
            bonusConcedidoAt: null
        });

        const res = await request(app).get(endpointObter);

        console.log('Response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.nome).toBe('Joao Da Silva');
    });

    it('atualiza perfil sem bônus se incompleto', async () => {
        mockFindUnique.mockResolvedValue({ bonusConcedidoAt: null });
        mockUpdate.mockResolvedValue({ bonusConcedidoAt: null });

        const res = await request(app).post(endpointAtualizar).send({
            nome: 'Maria',
            telefone: '11999999999',
            nascimento: '', // Incompleto
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'F'
        });

        console.log('Response:', res.body);

        expect(mockUpdate).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.bonusConcedido).toBe(false);
    });

    it('atualiza perfil e concede bônus se completo', async () => {
        mockFindUnique.mockResolvedValue({ bonusConcedidoAt: null });
        mockUpdate.mockResolvedValue({ bonusConcedidoAt: new Date() });

        const res = await request(app).post(endpointAtualizar).send({
            nome: 'Maria',
            telefone: '11999999999',
            nascimento: '1990-01-01',
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'F'
        });

        console.log('Response:', res.body);

        expect(mockUpdate).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.bonusConcedido).toBe(true);
    });

    it('atualiza perfil normalmente se bônus já foi concedido', async () => {
        mockFindUnique.mockResolvedValue({ bonusConcedidoAt: new Date() });
        mockUpdate.mockResolvedValue({});

        const res = await request(app).post(endpointAtualizar).send({
            nome: 'Maria',
            telefone: '11999999999',
            nascimento: '1990-01-01',
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'F'
        });

        console.log('Response:', res.body);

        expect(mockUpdate).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.bonusConcedido).toBe(false);
    });

    it('retorna 500 se erro interno em obterPerfil', async () => {
        mockFindUnique.mockRejectedValue(new Error('Erro interno'));

        const res = await request(app).get(endpointObter);

        console.log('Response:', res.body);

        expect(res.statusCode).toBe(500);
        expect(typeof res.body.error).toBe('string');
    });

    it('retorna 500 se erro interno em atualizarPerfil', async () => {
        mockFindUnique.mockResolvedValue({ bonusConcedidoAt: null });
        mockUpdate.mockRejectedValue(new Error('Erro interno'));

        const res = await request(app).post(endpointAtualizar).send({
            nome: 'Maria',
            telefone: '11999999999',
            nascimento: '1990-01-01',
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'F'
        });

        console.log('Response:', res.body);

        expect(res.statusCode).toBe(500);
        expect(typeof res.body.error).toBe('string');
    });

    it('retorna perfil com nome vazio se nome for nulo', async () => {
        mockFindUnique.mockResolvedValue({
            email: 'teste@email.com',
            cpf: '12345678909',
            nome: null,
            telefone: '11999999999',
            nascimento: new Date('1990-01-01'),
            cidade: 'São Paulo',
            uf: 'SP',
            genero: 'M',
            bonusConcedidoAt: null
        });

        const res = await request(app).get(endpointObter);
        console.log('Response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.nome).toBe('');
    });
});
