"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAvaliacaoAdminService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteAvaliacaoAdminService {
    async execute({ id }) {
        const validacao = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
            where: {
                id,
            },
        });
        if (!validacao) {
            throw new Error('Validação não encontrada');
        }
        const deleteAvaliacao = await prismaClient_1.prismaClient.validacaoAgendamento.update({
            where: {
                id,
            },
            data: {
                deletedAvaliacao: true,
            },
        });
        return deleteAvaliacao;
    }
}
exports.DeleteAvaliacaoAdminService = DeleteAvaliacaoAdminService;
