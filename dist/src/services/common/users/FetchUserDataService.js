"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserDataService = void 0;
const logger_1 = require("../../../config/logger");
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserDataService {
    async execute({ userId }) {
        if (!userId) {
            logger_1.logger.error('O ID do usuário é obrigatório.');
            throw new Error('O ID do usuário é obrigatório.');
        }
        const user = await prismaClient_1.prismaClient.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            logger_1.logger.error('Usuário não encontrado.', { userId });
            throw new Error('Usuário não encontrado.');
        }
        logger_1.logger.info('Dados do usuário buscados com sucesso.', {
            userId: user.id,
            email: user.email,
        });
        return user;
    }
}
exports.FetchUserDataService = FetchUserDataService;
