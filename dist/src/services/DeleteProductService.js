"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteProductService {
    async execute({ produtoId }) {
        const produto = await prismaClient_1.prismaClient.servico.findUnique({
            where: { id: produtoId, deleted: false },
        });
        if (!produto) {
            throw new Error('Produto não encontrado.');
        }
        const updateUserService = await prismaClient_1.prismaClient.servico.update({
            where: { id: produto.id, deleted: false },
            data: {
                deleted: true,
            },
        });
        return updateUserService;
    }
}
exports.DeleteProductService = DeleteProductService;
