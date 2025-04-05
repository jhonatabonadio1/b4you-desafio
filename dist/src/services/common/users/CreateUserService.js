"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const prismaClient_1 = require("../../../database/prismaClient");
const logger_1 = require("../../../config/logger");
class CreateUserService {
    async execute({ email, password, firstName, lastName }) {
        logger_1.logger.info('Iniciando criação de usuário', { email });
        if (!email || !password || !firstName || !lastName) {
            logger_1.logger.error('Campos obrigatórios não preenchidos.', {
                email,
                password: Boolean(password),
                firstName,
                lastName,
            });
            throw new Error('Preencha os campos obrigatórios.');
        }
        const existingUser = await prismaClient_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,})/.test(password)) {
            logger_1.logger.error('Senha inválida.', { email });
            throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.');
        }
        if (existingUser) {
            logger_1.logger.error('Usuário já existe.', {
                userId: existingUser.id,
                email: existingUser.email,
            });
            throw new Error('Usuário já existe.');
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 12);
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const createUser = await prismaClient_1.prismaClient.user.create({
            data: {
                email,
                firstName: capitalize(firstName),
                lastName: capitalize(lastName),
                password: hashedPassword,
            },
        });
        logger_1.logger.info('Usuário criado com sucesso.', {
            userId: createUser.id,
            email: createUser.email,
        });
        return { message: 'Sua conta foi criada, faça o login.' };
    }
}
exports.CreateUserService = CreateUserService;
