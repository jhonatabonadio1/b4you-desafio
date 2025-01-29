"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllPropertiesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class ListAllPropertiesService {
    async execute() {
        // Busca todas as propriedades no banco de dados
        const properties = await prismaClient_1.prismaClient.properties.findMany({});
        // Adiciona o nome do usuário relacionado às propriedades
        const data = await Promise.all(properties.map(async (property) => {
            const user = await prismaClient_1.prismaClient.users.findUnique({
                where: { id: property.user },
            });
            return Object.assign(Object.assign({}, property), { userName: (user === null || user === void 0 ? void 0 : user.nome) || 'Usuário Desconhecido' });
        }));
        return data;
    }
}
exports.ListAllPropertiesService = ListAllPropertiesService;
