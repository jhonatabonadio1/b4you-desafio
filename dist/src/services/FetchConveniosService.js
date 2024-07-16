"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchConveniosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchConveniosService {
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
        const totalConvenios = await prismaClient_1.prismaClient.convenios.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalConvenios / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const convenios = await prismaClient_1.prismaClient.convenios.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        return {
            convenios,
            currentPage: page,
            totalPages,
            totalConvenios,
        };
    }
}
exports.FetchConveniosService = FetchConveniosService;
