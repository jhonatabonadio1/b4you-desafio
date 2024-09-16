"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAvaliacoesPendentesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAvaliacoesPendentesService {
    async execute({ userId }) {
        const avaliacoes = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: {
                usuario: {
                    id: userId,
                },
                OR: [
                    { avaliado: null },
                    { avaliado: false },
                    { avaliado: { equals: undefined } },
                ],
            },
            include: {
                prestador: {
                    select: {
                        razaoSocial: true,
                    },
                },
            },
        });
        const arrayFormatted = [];
        for (const validacao of avaliacoes) {
            const avaliacao = {
                id: validacao.id,
                storeName: validacao.prestador.razaoSocial,
                pendente: !validacao.avaliado,
                data_utilizacao: validacao.created_at,
            };
            arrayFormatted.push(avaliacao);
        }
        return arrayFormatted;
    }
}
exports.FetchAvaliacoesPendentesService = FetchAvaliacoesPendentesService;
