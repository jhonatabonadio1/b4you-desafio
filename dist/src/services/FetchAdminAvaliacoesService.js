"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminAvaliacoesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAdminAvaliacoesService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { avaliado: true };
        const searchWhere = search
            ? {
                AND: [
                    { avaliado: true },
                    {
                        OR: [
                            {
                                prestador: {
                                    OR: [
                                        {
                                            razaoSocial: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            inscricao: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                usuario: {
                                    OR: [
                                        {
                                            nome: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            cpf: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalAvaliacoes = await prismaClient_1.prismaClient.validacaoAgendamento.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalAvaliacoes / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const avaliacoes = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                avaliado: true,
                message: true,
                estrelas: true,
                dataAvaliacao: true,
                servicoCompleto: true,
                bomAtendimento: true,
                prestador: {
                    select: {
                        razaoSocial: true,
                        inscricao: true,
                    },
                },
                usuario: {
                    select: {
                        nome: true,
                        cpf: true,
                    },
                },
            },
            orderBy: { dataAvaliacao: 'desc' },
        });
        return {
            avaliacoes,
            currentPage: page,
            totalPages,
            totalAvaliacoes,
        };
    }
}
exports.FetchAdminAvaliacoesService = FetchAdminAvaliacoesService;
