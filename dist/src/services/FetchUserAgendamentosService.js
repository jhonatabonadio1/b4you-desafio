"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserAgendamentosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserAgendamentosService {
    async execute({ userId }) {
        const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Usuário não encontrado');
        }
        const findAgendamnetos = await prismaClient_1.prismaClient.agendamento.findMany({
            where: {
                usuario: { id: findUser.id },
                ativo: true,
                deleted: false,
            },
            include: {
                prestador: true,
                servico: true,
                veiculo: true,
            },
        });
        const agendamentosNaoValidados = [];
        for (const agendamento of findAgendamnetos) {
            const verificaAgendamentoJaValidado = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
                where: { agendamentoId: agendamento.id },
            });
            if (!verificaAgendamentoJaValidado) {
                // Adicionar o agendamento ao array com as opções adicionais resolvidas
                agendamentosNaoValidados.push(Object.assign(Object.assign({}, agendamento), { opcoesAdicionais: JSON.parse(agendamento.opcoesAdicionais) }));
            }
        }
        return agendamentosNaoValidados;
    }
}
exports.FetchUserAgendamentosService = FetchUserAgendamentosService;
