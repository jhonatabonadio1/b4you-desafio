"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoUserService = void 0;
const axios_1 = __importDefault(require("axios"));
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
        if (agendamento.data) {
            const dataAgendamento = new Date(agendamento.data);
            const umaHoraAntes = (0, date_fns_1.subHours)(dataAgendamento, 1);
            const trintaMinutosDepois = (0, date_fns_1.addMinutes)(dataAgendamento, 30);
            const agora = new Date();
            // Permitir o cancelamento até 1 hora antes do agendamento
            // ou após 30 minutos do horário do agendamento
            if ((0, date_fns_1.isBefore)(agora, umaHoraAntes) ||
                (0, date_fns_1.isBefore)(trintaMinutosDepois, agora)) {
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
                const dataString = new Date(agendamento.data).toISOString();
                const dataAgendamentoFormatada = (0, date_fns_1.format)((0, date_fns_1.parseISO)(dataString), "dd/MM/yyyy 'às' HH:mm");
                async function sendNotification() {
                    await axios_1.default.post('https://api.onesignal.com/notifications', {
                        app_id: process.env.ONESIGNAL_APP_ID,
                        name: 'Cancelamento',
                        target_channel: 'push',
                        headings: {
                            en: 'Agendamento cancelado',
                        },
                        include_aliases: { external_id: [agendamento === null || agendamento === void 0 ? void 0 : agendamento.prestadorId] },
                        contents: {
                            en: 'O agendamento do dia ' +
                                dataAgendamentoFormatada +
                                ' foi cancelado.',
                        },
                    }, {
                        headers: {
                            Authorization: process.env.ONESIGNAL_API_KEY,
                        },
                    });
                }
                if (deleteAgendamento) {
                    sendNotification();
                }
                return deleteAgendamento;
            }
            throw new Error('Você só pode cancelar até 1 hora antes do agendamento ou após 30 minutos do horário marcado.');
        }
    }
}
exports.DeleteAgendamentoUserService = DeleteAgendamentoUserService;
