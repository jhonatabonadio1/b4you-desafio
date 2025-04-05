"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const date_fns_1 = require("date-fns");
const prismaClient_1 = require("../../../database/prismaClient");
const logger_1 = require("../../../config/logger");
class SignInService {
    async execute({ email, password }) {
        logger_1.logger.info('Iniciando SignInService', { email });
        if (!email) {
            logger_1.logger.error('E-mail não fornecido');
            throw new Error('E-mail é obrigatório.');
        }
        if (!password) {
            logger_1.logger.error('Senha não fornecida', { email });
            throw new Error('Senha é obrigatória.');
        }
        const user = await prismaClient_1.prismaClient.user.findFirst({
            where: { email },
        });
        if (!user) {
            logger_1.logger.error('Usuário não encontrado', { email });
            throw new Error('E-mail/Senha incorretos.');
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            logger_1.logger.error('Senha incorreta', { email });
            throw new Error('E-mail/Senha incorretos.');
        }
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            subject: user.id,
            expiresIn: '7d',
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            email: user.email,
        }, process.env.JWT_REFRESH_SECRET, {
            subject: user.id,
            expiresIn: '30d',
        });
        await prismaClient_1.prismaClient.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: (0, date_fns_1.addDays)(new Date(), 30),
            },
        });
        logger_1.logger.info('Login realizado com sucesso', { userId: user.id });
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
}
exports.SignInService = SignInService;
