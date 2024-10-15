"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminValidacoesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAdminValidacoesService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = {};
        const searchWhere = search
            ? {
                AND: [
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
                            {
                                agendamento: {
                                    OR: [
                                        {
                                            servico: {
                                                nome: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                            },
                                        },
                                        {
                                            veiculo: {
                                                placa: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
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
        const totalValidacoes = await prismaClient_1.prismaClient.validacaoAgendamento.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalValidacoes / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const validacoes = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
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
                agendamento: {
                    include: {
                        servico: {
                            select: {
                                nome: true,
                            },
                        },
                        veiculo: true,
                    },
                },
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return {
            validacoes,
            currentPage: page,
            totalPages,
            totalValidacoes,
        };
    }
}
exports.FetchAdminValidacoesService = FetchAdminValidacoesService;
