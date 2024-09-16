"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliaAtendimentoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class AvaliaAtendimentoService {
    async execute({ id, userId, estrelas, mensagem, bomAtendimento, servicoCompleto, }) {
        const buscaAgendamneto = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
            where: {
                id,
                usuario: {
                    id: userId,
                },
                OR: [
                    { avaliado: null },
                    { avaliado: false },
                    { avaliado: { equals: undefined } },
                ],
            },
        });
        if (!buscaAgendamneto) {
            throw new Error('Agendamento não encontrado/inválido.');
        }
        const realizaAvaliacao = await prismaClient_1.prismaClient.validacaoAgendamento.update({
            where: {
                id,
                usuario: {
                    id: userId,
                },
                OR: [
                    { avaliado: null },
                    { avaliado: false },
                    { avaliado: { equals: undefined } },
                ],
            },
            data: {
                avaliado: true,
                message: mensagem,
                bomAtendimento,
                servicoCompleto,
                dataAvaliacao: new Date(),
                estrelas: parseInt(estrelas),
            },
        });
        return realizaAvaliacao;
    }
}
exports.AvaliaAtendimentoService = AvaliaAtendimentoService;
