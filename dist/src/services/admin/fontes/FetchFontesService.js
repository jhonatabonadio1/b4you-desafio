"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFontesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchFontesService {
    async execute() {
        const fontes = await prismaClient_1.prismaClient.fontes.findMany();
        if (!fontes || fontes.length === 0) {
            throw new Error('Nenhuma fonte encontrada.');
        }
        return fontes;
    }
}
exports.FetchFontesService = FetchFontesService;
