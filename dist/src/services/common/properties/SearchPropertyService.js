"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPropertyService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class SearchPropertyService {
    async execute(clientCode) {
        if (!clientCode) {
            throw new Error('O código do cliente é obrigatório.');
        }
        // Busca a propriedade pelo código do cliente
        const property = await prismaClient_1.prismaClient.properties.findFirst({
            where: {
                clientCode,
            },
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        return property;
    }
}
exports.SearchPropertyService = SearchPropertyService;
