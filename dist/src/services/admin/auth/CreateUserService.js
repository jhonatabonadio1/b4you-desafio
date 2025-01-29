"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const prismaClient_1 = require("../../../database/prismaClient");
class CreateUserService {
    async execute({ email, password, nome, role, token }) {
        // Verifica se o token foi fornecido
        if (!token) {
            throw new Error('Token não fornecido.');
        }
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!email || !password || !nome || !role) {
            throw new Error('Todos os campos são obrigatórios.');
        }
        // Verifica se já existe um usuário com o mesmo e-mail
        const existingUser = await prismaClient_1.prismaClient.users.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new Error('Usuário já existe.');
        }
        // Hash da senha
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 12);
        // Criação do usuário no banco de dados
        await prismaClient_1.prismaClient.users.create({
            data: {
                email,
                nome,
                v: 0,
                password: hashedPassword,
                role: role || 'user',
            },
        });
        // Retorno de sucesso
        return { message: 'Usuário criado com sucesso.' };
    }
}
exports.CreateUserService = CreateUserService;
