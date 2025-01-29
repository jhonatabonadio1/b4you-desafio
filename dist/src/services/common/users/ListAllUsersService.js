"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllUsersService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const client_1 = require("@prisma/client"); // Importa tipos do Prisma
class ListAllUsersService {
    async execute(search) {
        try {
            // Define o filtro para busca
            const query = search
                ? {
                    nome: {
                        contains: search, // Busca case-insensitive
                        mode: client_1.Prisma.QueryMode.insensitive, // Utiliza o tipo QueryMode do Prisma
                    },
                }
                : {};
            // Busca usuários no banco de dados com ordenação por nome
            const users = await prismaClient_1.prismaClient.users.findMany({
                where: query,
                orderBy: {
                    nome: 'asc', // Ordena pelo nome em ordem crescente
                },
            });
            return users;
        }
        catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw new Error('Falha ao listar usuários.');
        }
    }
}
exports.ListAllUsersService = ListAllUsersService;
