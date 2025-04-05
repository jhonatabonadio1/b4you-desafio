"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCampaingService = void 0;
const logger_1 = require("../../../config/logger");
const prismaClient_1 = require("../../../database/prismaClient");
class ReadCampaingService {
    async execute({ userId }) {
        logger_1.logger.info('Buscando campanhas para o usuário', { userId });
        const buscaCampanha = await prismaClient_1.prismaClient.campaing.findMany({
            where: { user: { id: userId, deleted: false }, deleted: false },
        });
        logger_1.logger.info('Campanhas retornadas', { userId, total: buscaCampanha.length });
        return buscaCampanha;
    }
}
exports.ReadCampaingService = ReadCampaingService;
