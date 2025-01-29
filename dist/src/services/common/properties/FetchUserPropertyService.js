"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserPropertyService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserPropertyService {
    async execute(userId, propertyId) {
        if (!propertyId) {
            throw new Error('O ID da propriedade é obrigatório.');
        }
        // Busca a propriedade pelo ID
        const property = await prismaClient_1.prismaClient.properties.findUnique({
            where: {
                id: propertyId,
            },
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        // Verifica se a propriedade pertence ao usuário
        if (property.user !== userId) {
            throw new Error('Você não tem permissão para acessar esta propriedade.');
        }
        return property;
    }
}
exports.FetchUserPropertyService = FetchUserPropertyService;
