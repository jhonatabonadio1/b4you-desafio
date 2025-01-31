"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllPropertiesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const CalculateLastUpdateService_1 = require("./CalculateLastUpdateService");
class ListAllPropertiesService {
    async execute() {
        const properties = await prismaClient_1.prismaClient.properties.findMany({});
        const calculateLastUpdateService = new CalculateLastUpdateService_1.CalculateLastUpdateService();
        const data = await Promise.all(properties.map(async (property) => {
            const user = await prismaClient_1.prismaClient.users.findFirst({
                where: { id: property.user },
            });
            const lastUpdate = await calculateLastUpdateService.execute(property.id);
            return Object.assign(Object.assign({}, property), { userName: (user === null || user === void 0 ? void 0 : user.nome) || 'Usuário Desconhecido', lastLinkUpdate: lastUpdate });
        }));
        return data;
    }
}
exports.ListAllPropertiesService = ListAllPropertiesService;
