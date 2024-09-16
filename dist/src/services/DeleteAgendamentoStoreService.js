"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoStoreService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteAgendamentoStoreService {
    async execute({ id, usuarioId }) {
        // Encontrar o agendamento
        const agendamento = await prismaClient_1.prismaClient.agendamento.findFirst({
            where: {
                id,
                prestador: { id: usuarioId },
                deleted: false,
            },
        });
        if (!agendamento) {
            throw new Error('Agendamento não encontrado ou não pertence ao usuário.');
        }
        // Verificar se o agendamento foi validado
        const validacao = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
            where: {
                agendamentoId: id,
            },
        });
        // Se o agendamento foi validado, não pode ser cancelado
        if (validacao) {
            throw new Error('Este agendamento já foi validado e não pode ser cancelado.');
        }
        const deleteAgendamento = await prismaClient_1.prismaClient.agendamento.update({
            where: {
                id,
            },
            data: {
                deleted: true,
                ativo: false,
            },
        });
        return deleteAgendamento;
    }
}
exports.DeleteAgendamentoStoreService = DeleteAgendamentoStoreService;
