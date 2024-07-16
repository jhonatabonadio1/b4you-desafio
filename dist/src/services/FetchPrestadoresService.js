"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadoresService = void 0;
const prismaClient_1 = require("../database/prismaClient");
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchPrestadoresService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            {
                                inscricao: { contains: search, mode: 'insensitive' },
                            },
                            { email: { contains: search, mode: 'insensitive' } },
                            {
                                razaoSocial: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalUsers = await prismaClient_1.prismaClient.prestador.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const users = await prismaClient_1.prismaClient.prestador.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        const usersWithoutPassword = users.map((user) => exclude(user, ['password']));
        return {
            prestadores: usersWithoutPassword,
            currentPage: page,
            totalPages,
            totalUsers,
        };
    }
}
exports.FetchPrestadoresService = FetchPrestadoresService;
