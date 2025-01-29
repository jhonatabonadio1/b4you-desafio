"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchImovelService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class SearchImovelService {
    async execute(imovelCode) {
        if (!imovelCode) {
            throw new Error('O código do imóvel é obrigatório.');
        }
        // Busca o imóvel pelo código
        const imovel = await prismaClient_1.prismaClient.imovels.findFirst({
            where: {
                imovelCode,
            },
        });
        if (!imovel) {
            throw new Error('Imóvel não encontrado.');
        }
        return imovel;
    }
}
exports.SearchImovelService = SearchImovelService;
