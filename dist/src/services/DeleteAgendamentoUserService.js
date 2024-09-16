"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoUserService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const date_fns_1 = require("date-fns");
class DeleteAgendamentoUserService {
    async execute({ id, usuarioId }) {
        // Encontrar o agendamento
        const agendamento = await prismaClient_1.prismaClient.agendamento.findFirst({
            where: {
                id,
                usuarioId,
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
        const dataAgendamento = new Date(agendamento.data);
        const umaHoraAntes = (0, date_fns_1.subHours)(dataAgendamento, 1);
        const trintaMinutosDepois = (0, date_fns_1.addMinutes)(dataAgendamento, 30);
        const agora = new Date();
        // Permitir o cancelamento até 1 hora antes do agendamento
        // ou após 30 minutos do horário do agendamento
        if ((0, date_fns_1.isBefore)(agora, umaHoraAntes) || (0, date_fns_1.isBefore)(trintaMinutosDepois, agora)) {
            // Se passar nas verificações, cancelar o agendamento
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
        throw new Error('Você só pode cancelar até 1 hora antes do agendamento ou após 30 minutos do horário marcado.');
    }
}
exports.DeleteAgendamentoUserService = DeleteAgendamentoUserService;
