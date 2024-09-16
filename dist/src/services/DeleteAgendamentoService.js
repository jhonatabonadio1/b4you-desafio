"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteAgendamentoService {
    async execute({ id }) {
        const agendamento = await prismaClient_1.prismaClient.agendamento.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!agendamento) {
            throw new Error('Agendamento não encontrado');
        }
        const deleteAgendamento = await prismaClient_1.prismaClient.agendamento.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                deleted: true,
                ativo: false,
            },
        });
        return deleteAgendamento;
    }
}
exports.DeleteAgendamentoService = DeleteAgendamentoService;
