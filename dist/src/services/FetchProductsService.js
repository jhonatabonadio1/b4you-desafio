"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductsService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchProductsService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            {
                                nome: { contains: search, mode: 'insensitive' },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalProdutos = await prismaClient_1.prismaClient.servico.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalProdutos / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const produtos = await prismaClient_1.prismaClient.servico.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                nome: true,
                ativo: true,
                exigeVeiculo: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return {
            produtos,
            currentPage: page,
            totalPages,
            totalProdutos,
        };
    }
}
exports.FetchProductsService = FetchProductsService;
