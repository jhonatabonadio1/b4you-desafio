"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllImoveisService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class ListAllImoveisService {
    async execute() {
        try {
            // Busca todos os imóveis no banco de dados
            const properties = await prismaClient_1.prismaClient.imovels.findMany();
            // Mapeia os imóveis para buscar o nome do usuário associado
            const data = await Promise.all(properties.map(async (property) => {
                // Busca o usuário pelo ID armazenado no campo `user`
                const user = await prismaClient_1.prismaClient.users.findFirst({
                    where: {
                        id: property.user,
                        deleted: false, // `user` é uma string com o ID
                    },
                });
                return Object.assign(Object.assign({}, property), { userName: (user === null || user === void 0 ? void 0 : user.nome) || null });
            }));
            return data;
        }
        catch (error) {
            throw new Error('Falha ao buscar os imóveis.');
        }
    }
}
exports.ListAllImoveisService = ListAllImoveisService;
