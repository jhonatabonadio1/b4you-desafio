"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCampaingService = void 0;
const logger_1 = require("../../../config/logger");
const prismaClient_1 = require("../../../database/prismaClient");
class CreateCampaingService {
    async execute({ nome, orcamento, status, userId }) {
        logger_1.logger.info('Iniciando criação de campanha', {
            nome,
            orcamento,
            status,
            userId,
        });
        if (!nome ||
            status === null ||
            status === undefined ||
            orcamento === null ||
            orcamento === undefined) {
            logger_1.logger.error('Campos obrigatórios não preenchidos', {
                nome,
                orcamento,
                status,
            });
            throw new Error('Preencha os campos obrigatórios.');
        }
        const buscaUsuario = await prismaClient_1.prismaClient.user.findUnique({
            where: { id: userId, deleted: false },
        });
        if (!buscaUsuario) {
            logger_1.logger.error('Usuário não encontrado/autorizado', { userId });
            throw new Error('Usuário não encontrado/autorizado.');
        }
        const VALOR_ORCAMENTO_CENTS = orcamento * 100;
        const campaing = await prismaClient_1.prismaClient.campaing.create({
            data: {
                nome,
                orcamento: VALOR_ORCAMENTO_CENTS,
                status,
                user: {
                    connect: buscaUsuario,
                },
            },
        });
        logger_1.logger.info('Campanha criada com sucesso', {
            campaingId: campaing.id,
            userId,
        });
        return campaing;
    }
}
exports.CreateCampaingService = CreateCampaingService;
