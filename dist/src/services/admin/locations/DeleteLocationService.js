"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLocationService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteLocationService {
    async execute(sigla, cidade) {
        if (!sigla || !cidade) {
            throw new Error('A sigla e a cidade são obrigatórias.');
        }
        const location = await prismaClient_1.prismaClient.locations.findFirst({
            where: { sigla },
        });
        if (!location) {
            throw new Error('Localização não encontrada.');
        }
        // Remove a cidade da lista
        const updatedCidades = location.cidades.filter((c) => c !== cidade);
        await prismaClient_1.prismaClient.locations.update({
            where: { id: location.id },
            data: {
                cidades: updatedCidades,
            },
        });
        return { message: 'Cidade removida com sucesso.' };
    }
}
exports.DeleteLocationService = DeleteLocationService;
