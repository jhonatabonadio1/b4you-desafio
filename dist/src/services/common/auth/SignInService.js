"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = require("../../../database/prismaClient");
// Função para excluir chaves sensíveis do usuário
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class SignInService {
    async execute({ email, password }) {
        if (!email) {
            throw new Error('E-mail é obrigatório.');
        }
        if (!password) {
            throw new Error('Senha é obrigatória.');
        }
        // Busca o usuário no banco de dados
        const user = await prismaClient_1.prismaClient.users.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error('E-mail/Senha incorretos.');
        }
        // Compara a senha informada com a senha armazenada
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new Error('E-mail/Senha incorretos.');
        }
        // Geração do token JWT
        const token = (0, jsonwebtoken_1.sign)({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET, {
            subject: user.id,
            expiresIn: '1d',
        });
        // Exclui chaves sensíveis antes de retornar os dados do usuário
        const userWithoutSensitiveKeys = exclude(user, ['password']);
        return {
            token,
            user: userWithoutSensitiveKeys,
        };
    }
}
exports.SignInService = SignInService;
