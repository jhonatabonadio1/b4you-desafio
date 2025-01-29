"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFonteService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class CreateFonteService {
    async execute(nome) {
        if (!nome) {
            throw new Error('O nome da fonte é obrigatório.');
        }
        const fonteExistente = await prismaClient_1.prismaClient.fontes.findFirst({
            where: { nome },
        });
        if (fonteExistente) {
            throw new Error('Fonte já cadastrada.');
        }
        const fonte = await prismaClient_1.prismaClient.fontes.create({
            data: { nome, v: 0 },
        });
        return fonte;
    }
}
exports.CreateFonteService = CreateFonteService;
