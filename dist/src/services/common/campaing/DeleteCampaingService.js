"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCampaingService = void 0;
const logger_1 = require("../../../config/logger");
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteCampaingService {
    async execute({ id, userId }) {
        logger_1.logger.info('Iniciando deleção da campanha', { campaignId: id, userId });
        if (!id) {
            logger_1.logger.error('ID da campanha não informado', { campaignId: id });
            throw new Error('ID da campanha não informado;');
        }
        const buscaUsuario = await prismaClient_1.prismaClient.user.findUnique({
            where: { id: userId, deleted: false },
        });
        if (!buscaUsuario) {
            logger_1.logger.error('Usuário não encontrado/autorizado', { userId });
            throw new Error('Usuário não encontrado/autorizado.');
        }
        const buscaCampanha = await prismaClient_1.prismaClient.campaing.findUnique({
            where: { id, user: { id: buscaUsuario.id }, deleted: false },
        });
        if (!buscaCampanha) {
            logger_1.logger.error('Campanha não encontrada', { campaignId: id, userId });
            throw new Error('Campanha não encontrada.');
        }
        await prismaClient_1.prismaClient.campaing.update({
            where: { id: buscaCampanha.id },
            data: { deleted: true },
        });
        logger_1.logger.info('Campanha excluída com sucesso', {
            campaignId: buscaCampanha.id,
            userId,
        });
        return { message: 'Camapanha excluída' };
    }
}
exports.DeleteCampaingService = DeleteCampaingService;
