"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreAgendamentosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchStoreAgendamentosService {
    async execute({ storeId }) {
        const findUser = await prismaClient_1.prismaClient.prestador.findFirst({
            where: { id: storeId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Prestador não encontrado');
        }
        const findAgendamnetos = await prismaClient_1.prismaClient.agendamento.findMany({
            where: { prestador: { id: findUser.id }, ativo: true, deleted: false },
            include: {
                usuario: true,
                servico: true,
                veiculo: true,
            },
        });
        const agendamentosNaoValidados = [];
        for (const agendamento of findAgendamnetos) {
            const jaValidado = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
                where: { agendamentoId: agendamento.id },
            });
            if (!jaValidado) {
                agendamentosNaoValidados.push(agendamento);
            }
        }
        return agendamentosNaoValidados;
    }
}
exports.FetchStoreAgendamentosService = FetchStoreAgendamentosService;
