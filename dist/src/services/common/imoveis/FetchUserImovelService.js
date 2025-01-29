"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserImovelService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserImovelService {
    async execute(userId, imovelId) {
        if (!imovelId) {
            throw new Error('O ID do imóvel é obrigatório.');
        }
        // Busca o imóvel pelo ID
        const property = await prismaClient_1.prismaClient.imovels.findUnique({
            where: {
                id: imovelId,
            },
        });
        if (!property) {
            throw new Error('Imóvel não encontrado.');
        }
        // Verifica se o imóvel pertence ao usuário
        if (property.user !== userId) {
            throw new Error('Você não tem permissão para acessar este imóvel.');
        }
        return property;
    }
}
exports.FetchUserImovelService = FetchUserImovelService;
