"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchInformativosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchInformativosService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            {
                                titulo: { contains: search, mode: 'insensitive' },
                            },
                            { texto: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalInformativos = await prismaClient_1.prismaClient.informativos.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalInformativos / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const informativos = await prismaClient_1.prismaClient.informativos.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        return {
            informativos,
            currentPage: page,
            totalPages,
            totalInformativos,
        };
    }
}
exports.FetchInformativosService = FetchInformativosService;
