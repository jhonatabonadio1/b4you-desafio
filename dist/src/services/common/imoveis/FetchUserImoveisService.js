"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserImoveisService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserImoveisService {
    async execute(userId) {
        if (!userId) {
            throw new Error('O ID do usuário é obrigatório.');
        }
        // Busca todos os imóveis associados ao usuário
        const properties = await prismaClient_1.prismaClient.imovels.findMany({
            where: {
                user: userId,
            },
        });
        return properties;
    }
}
exports.FetchUserImoveisService = FetchUserImoveisService;
