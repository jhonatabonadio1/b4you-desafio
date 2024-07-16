"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBrindesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchBrindesService {
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
        const totalBrindes = await prismaClient_1.prismaClient.brinde.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalBrindes / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const brindes = await prismaClient_1.prismaClient.brinde.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        return {
            brindes,
            currentPage: page,
            totalPages,
            totalBrindes,
        };
    }
}
exports.FetchBrindesService = FetchBrindesService;
