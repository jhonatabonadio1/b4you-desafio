"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const date_fns_1 = require("date-fns");
const prismaClient_1 = require("../../../database/prismaClient");
const logger_1 = require("../../../config/logger");
class RefreshTokenService {
    async execute(refreshToken) {
        logger_1.logger.info('Iniciando RefreshTokenService', {
            tokenPrefix: refreshToken.slice(0, 10),
        });
        if (!refreshToken) {
            logger_1.logger.error('Refresh token não fornecido');
            throw new Error('Refresh token é obrigatório.');
        }
        const storedToken = await prismaClient_1.prismaClient.refreshToken.findFirst({
            where: { token: refreshToken },
        });
        if (!storedToken) {
            logger_1.logger.error('Refresh token inválido - token não encontrado no banco de dados', { tokenPrefix: refreshToken.slice(0, 10) });
            throw new Error('Refresh token inválido.');
        }
        let decoded;
        try {
            decoded = (0, jsonwebtoken_1.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch (error) {
            logger_1.logger.error('Erro na verificação do refresh token', {
                error: error.message,
            });
            throw new Error('Refresh token inválido.');
        }
        const userId = decoded.sub;
        const newAccessToken = (0, jsonwebtoken_1.sign)({ userId, email: decoded.email }, process.env.JWT_SECRET, { subject: userId, expiresIn: '15m' });
        const newRefreshToken = (0, jsonwebtoken_1.sign)({ email: decoded.email }, process.env.JWT_REFRESH_SECRET, { subject: userId, expiresIn: '30d' });
        await prismaClient_1.prismaClient.refreshToken.deleteMany({
            where: { userId },
        });
        await prismaClient_1.prismaClient.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId,
                expiresAt: (0, date_fns_1.addDays)(new Date(), 30),
            },
        });
        logger_1.logger.info('Refresh token gerado com sucesso', {
            userId,
            accessTokenPrefix: newAccessToken.slice(0, 10),
            refreshTokenPrefix: newRefreshToken.slice(0, 10),
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}
exports.RefreshTokenService = RefreshTokenService;
