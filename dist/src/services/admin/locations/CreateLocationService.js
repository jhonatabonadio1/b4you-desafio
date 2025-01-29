"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocationService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class CreateLocationService {
    async execute(sigla, cidade) {
        if (!sigla || !cidade) {
            throw new Error('A sigla e a cidade são obrigatórias.');
        }
        const location = await prismaClient_1.prismaClient.locations.findFirst({
            where: { sigla },
        });
        if (location) {
            // Adiciona uma nova cidade à lista de cidades
            await prismaClient_1.prismaClient.locations.update({
                where: { id: location.id },
                data: {
                    cidades: {
                        push: cidade,
                    },
                },
            });
            return { message: 'Cidade adicionada à localização existente.' };
        }
        else {
            // Cria uma nova localização
            const newLocation = await prismaClient_1.prismaClient.locations.create({
                data: {
                    sigla,
                    cidades: [cidade],
                },
            });
            return newLocation;
        }
    }
}
exports.CreateLocationService = CreateLocationService;
