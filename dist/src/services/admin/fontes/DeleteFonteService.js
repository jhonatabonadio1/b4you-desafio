"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFonteService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteFonteService {
    async execute(id) {
        if (!id) {
            throw new Error('O ID da fonte é obrigatório.');
        }
        const fonte = await prismaClient_1.prismaClient.fontes.findUnique({
            where: { id },
        });
        if (!fonte) {
            throw new Error('Fonte não encontrada.');
        }
        await prismaClient_1.prismaClient.fontes.delete({
            where: { id },
        });
        return { message: 'Fonte deletada com sucesso.' };
    }
}
exports.DeleteFonteService = DeleteFonteService;
