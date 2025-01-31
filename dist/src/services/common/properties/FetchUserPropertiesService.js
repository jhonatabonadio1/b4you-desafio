"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserPropertiesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserPropertiesService {
    async execute(userId) {
        if (!userId) {
            throw new Error('O ID do usuário é obrigatório.');
        }
        // Busca todas as propriedades associadas ao usuário
        const properties = await prismaClient_1.prismaClient.properties.findMany({
            where: {
                user: userId,
            },
        });
        if (!properties || properties.length === 0) {
            throw new Error('Nenhuma propriedade encontrada para este usuário.');
        }
        const data = await Promise.all(properties.map(async (property) => {
            const user = await prismaClient_1.prismaClient.users.findFirst({
                where: { id: property.user, deleted: false },
            });
            return Object.assign(Object.assign({}, property), { userName: (user === null || user === void 0 ? void 0 : user.nome) || 'Usuário Desconhecido' });
        }));
        return data;
    }
}
exports.FetchUserPropertiesService = FetchUserPropertiesService;
