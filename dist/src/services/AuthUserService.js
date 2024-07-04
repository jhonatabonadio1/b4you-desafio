"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class AuthUserService {
    async execute({ matricula, password, accessType }) {
        if (!matricula) {
            throw new Error('Login é obrigatório.');
        }
        if (!password) {
            throw new Error('Senha é obrigatória.');
        }
        if (!accessType) {
            throw new Error('Tipo de acesso é obrigatório.');
        }
        if (accessType !== 1 && accessType !== 2) {
            throw new Error('Tipo de acesso inválido.');
        }
        if (accessType === 1) {
            const user = await prismaClient_1.prismaClient.usuario.findFirst({
                where: {
                    matricula,
                    deleted: false,
                },
            });
            if (!user) {
                throw new Error('Matrícula/Senha incorretos.');
            }
            const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatch) {
                throw new Error('Matrícula/Senha incorretos.');
            }
            const token = (0, jsonwebtoken_1.sign)({
                matricula: user.matricula,
            }, process.env.AUTH_TOKEN, {
                subject: user.id,
            });
            const userWithoutSensiveKeys = exclude(user, ['password']);
            const response = {
                token,
                user: Object.assign(Object.assign({}, userWithoutSensiveKeys), { nascimento: user.birth }),
                accessType,
            };
            return response;
        }
        const inscricaoString = matricula.toString().replace(/\D/g, '');
        if (accessType === 2) {
            const user = await prismaClient_1.prismaClient.prestador.findFirst({
                where: {
                    inscricao: inscricaoString,
                    deleted: false,
                },
            });
            if (!user) {
                throw new Error('Inscrição/Senha incorretos.');
            }
            const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatch) {
                throw new Error('Inscrição/Senha incorretos.');
            }
            const token = (0, jsonwebtoken_1.sign)({
                inscricao: user.inscricao,
            }, process.env.AUTH_TOKEN, {
                subject: user.id,
            });
            const userWithoutSensiveKeys = exclude(user, ['password']);
            const response = {
                token,
                user: userWithoutSensiveKeys,
                accessType,
            };
            return response;
        }
    }
}
exports.AuthUserService = AuthUserService;
