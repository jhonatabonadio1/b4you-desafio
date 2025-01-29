"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTipoService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteTipoService {
    async execute(id) {
        if (!id) {
            throw new Error('O ID do tipo é obrigatório.');
        }
        const tipo = await prismaClient_1.prismaClient.tipos.findUnique({
            where: { id },
        });
        if (!tipo) {
            throw new Error('Tipo não encontrado.');
        }
        await prismaClient_1.prismaClient.tipos.delete({
            where: { id },
        });
        return { message: 'Tipo deletado com sucesso.' };
    }
}
exports.DeleteTipoService = DeleteTipoService;
