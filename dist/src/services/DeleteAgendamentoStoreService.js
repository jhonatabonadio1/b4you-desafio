"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoStoreService = void 0;
const axios_1 = __importDefault(require("axios"));
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
        const prestador = await prismaClient_1.prismaClient.prestador.findFirst({
            where: { id: usuarioId, deleted: false },
        });
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
        async function sendNotification() {
            await axios_1.default.post('https://api.onesignal.com/notifications', {
                app_id: process.env.ONESIGNAL_APP_ID,
                name: 'Cancelamento',
                target_channel: 'push',
                headings: {
                    en: 'Seu agendamento foi cancelado',
                },
                include_aliases: { external_id: [agendamento === null || agendamento === void 0 ? void 0 : agendamento.usuarioId] },
                contents: {
                    en: 'Seu agendamento com ' +
                        (prestador === null || prestador === void 0 ? void 0 : prestador.razaoSocial) +
                        ' foi cancelado. Entre no app para agendar novamente!',
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
}
exports.DeleteAgendamentoStoreService = DeleteAgendamentoStoreService;
