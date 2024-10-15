"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminValidacoesBrindesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAdminValidacoesBrindesService {
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
                                brinde: {
                                    OR: [
                                        {
                                            nome: {
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
        const totalValidacoesBrindes = await prismaClient_1.prismaClient.validacaoBrinde.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalValidacoesBrindes / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const validacoesBrindes = await prismaClient_1.prismaClient.validacaoBrinde.findMany({
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
                brinde: {
                    select: {
                        nome: true,
                    },
                },
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return {
            validacoesBrindes,
            currentPage: page,
            totalPages,
            totalValidacoesBrindes,
        };
    }
}
exports.FetchAdminValidacoesBrindesService = FetchAdminValidacoesBrindesService;
