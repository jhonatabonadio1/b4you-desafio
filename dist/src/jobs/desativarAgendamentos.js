"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prismaClient_1 = require("../database/prismaClient");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
async function desativarAgendamentosVencidos() {
    const umMesAtras = moment_timezone_1.default.tz('America/Sao_Paulo').subtract(1, 'day').toDate();
    try {
        const result = await prismaClient_1.prismaClient.agendamento.updateMany({
            where: {
                deleted: false,
                ativo: true,
                semValidade: false,
                data: {
                    lt: umMesAtras,
                },
            },
            data: {
                ativo: false,
            },
        });
        console.log(`Agendamentos desativados: ${result.count}`);
    }
    catch (error) {
        console.error('Erro ao desativar agendamentos:', error);
    }
}
async function reexecutarJobsPerdidos() {
    const umMesAtras = moment_timezone_1.default
        .tz('America/Sao_Paulo')
        .subtract(1, 'month')
        .toDate();
    try {
        const agendamentosPerdidos = await prismaClient_1.prismaClient.agendamento.findMany({
            where: {
                deleted: false,
                ativo: true,
                semValidade: false,
                data: {
                    lt: umMesAtras,
                },
            },
        });
        if (agendamentosPerdidos.length > 0) {
            console.log(`Reexecutando jobs perdidos para ${agendamentosPerdidos.length} agendamentos.`);
            await desativarAgendamentosVencidos();
        }
    }
    catch (error) {
        console.error('Erro ao reexecutar jobs perdidos:', error);
    }
}
// Agendando o cronjob para rodar todos os dias à meia-noite
node_cron_1.default.schedule('0 0 * * *', () => {
    console.log('Executando tarefa de desativação de agendamentos vencidos');
    desativarAgendamentosVencidos();
}, {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
});
reexecutarJobsPerdidos();
