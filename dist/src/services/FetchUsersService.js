"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsersService = void 0;
const prismaClient_1 = require("../database/prismaClient");
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchUsersService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            { phone: { contains: search, mode: 'insensitive' } },
                            { nome: { contains: search, mode: 'insensitive' } },
                            {
                                matricula: { equals: search, mode: 'insensitive' },
                            },
                            { email: { contains: search, mode: 'insensitive' } },
                            {
                                cpf: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalUsers = await prismaClient_1.prismaClient.usuario.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const users = await prismaClient_1.prismaClient.usuario.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        const usersWithoutPassword = users.map((user) => exclude(user, ['password']));
        return {
            users: usersWithoutPassword,
            currentPage: page,
            totalPages,
            totalUsers,
        };
    }
}
exports.FetchUsersService = FetchUsersService;
