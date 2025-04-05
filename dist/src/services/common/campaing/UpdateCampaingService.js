"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCampaingService = void 0;
const logger_1 = require("../../../config/logger");
const prismaClient_1 = require("../../../database/prismaClient");
class UpdateCampaingService {
    async execute({ id, nome, orcamento, status, userId, }) {
        logger_1.logger.info('Iniciando atualização da campanha', { campaignId: id, userId });
        if (!id) {
            logger_1.logger.error('Campos obrigatórios não preenchidos', { campaignId: id });
            throw new Error('Preencha os campos obrigatórios.');
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
        const VALOR_ORCAMENTO_CENTS = orcamento * 100;
        let statusMessage;
        switch (status) {
            case 0:
                statusMessage = 'inativo';
                break;
            case 1:
                statusMessage = 'ativo';
                break;
            case 2:
                statusMessage = 'pausado';
                break;
            default:
                statusMessage = 'inativo';
                break;
        }
        const UPDATED_DATA = {
            nome: nome !== null && nome !== void 0 ? nome : buscaCampanha.nome,
            orcamento: orcamento ? VALOR_ORCAMENTO_CENTS : buscaCampanha.orcamento,
            status: status ? statusMessage : buscaCampanha.status,
        };
        const campaing = await prismaClient_1.prismaClient.campaing.update({
            where: { id: buscaCampanha.id },
            data: UPDATED_DATA,
        });
        logger_1.logger.info('Campanha atualizada com sucesso', {
            campaignId: campaing.id,
            userId,
            updatedData: UPDATED_DATA,
        });
        return campaing;
    }
}
exports.UpdateCampaingService = UpdateCampaingService;
