"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreAvaliacoesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchStoreAvaliacoesService {
    async execute({ storeId }) {
        const findUser = await prismaClient_1.prismaClient.prestador.findFirst({
            where: { id: storeId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Prestador não encontrado');
        }
        const findAvaliacoes = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: { prestador: { id: findUser.id }, avaliado: true },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                servicoCompleto: true,
                bomAtendimento: true,
                estrelas: true,
                message: true,
                dataAvaliacao: true,
            },
        });
        return findAvaliacoes;
    }
}
exports.FetchStoreAvaliacoesService = FetchStoreAvaliacoesService;
