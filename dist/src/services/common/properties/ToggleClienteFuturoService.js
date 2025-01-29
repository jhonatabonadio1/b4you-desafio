"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleClienteFuturoService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class ToggleClienteFuturoService {
    async execute(id) {
        if (!id) {
            throw new Error('O ID da propriedade é obrigatório.');
        }
        // Busca a propriedade pelo ID
        const property = await prismaClient_1.prismaClient.properties.findUnique({
            where: {
                id,
            },
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        // Atualiza o campo `clienteFuturo` para o oposto do valor atual
        const updatedProperty = await prismaClient_1.prismaClient.properties.update({
            where: {
                id,
            },
            data: {
                clienteFuturo: !property.clienteFuturo,
            },
        });
        return updatedProperty.clienteFuturo;
    }
}
exports.ToggleClienteFuturoService = ToggleClienteFuturoService;
