"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class AuthAdminService {
    async execute({ email, password }) {
        if (!email) {
            throw new Error('E-mail é obrigatório.');
        }
        if (!password) {
            throw new Error('Senha é obrigatória.');
        }
        const user = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                email,
                tipoAcesso: 'admin',
                deleted: false,
            },
        });
        if (!user) {
            throw new Error('E-mail/Senha incorretos.');
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new Error('E-mail/Senha incorretos.');
        }
        const token = (0, jsonwebtoken_1.sign)({
            matricula: user.matricula,
        }, process.env.AUTH_TOKEN, {
            subject: user.id,
        });
        const userWithoutSensiveKeys = exclude(user, ['password']);
        const response = {
            token,
            user: userWithoutSensiveKeys,
        };
        return response;
    }
}
exports.AuthAdminService = AuthAdminService;
