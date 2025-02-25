"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFilesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const client_1 = require("@prisma/client"); // Importa tipos do Prisma
class FetchFilesService {
    async execute(userId, search) {
        try {
            // Define o filtro para busca
            const query = search
                ? {
                    title: {
                        contains: search, // Busca case-insensitive
                        mode: client_1.Prisma.QueryMode.insensitive, // Utiliza o tipo QueryMode do Prisma
                    },
                }
                : {};
            // Busca usuários no banco de dados com ordenação por nome
            const files = await prismaClient_1.prismaClient.document.findMany({
                where: { ...query, userId },
                orderBy: {
                    updatedAt: 'desc', // Ordena pelo nome em ordem crescente
                },
            });
            const filesCompleted = [];
            for (const file of files) {
                filesCompleted.push({
                    ...file,
                    status: 'completed',
                });
            }
            return filesCompleted;
        }
        catch (error) {
            throw new Error('Falha ao listar documentos.');
        }
    }
}
exports.FetchFilesService = FetchFilesService;
//# sourceMappingURL=FetchFilesService.js.map