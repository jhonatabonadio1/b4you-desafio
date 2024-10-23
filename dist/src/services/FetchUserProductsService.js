"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserProductsService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserProductsService {
    async execute() {
        const findProducts = await prismaClient_1.prismaClient.servico.findMany({
            where: { ativo: true, deleted: false },
            include: {
                opcoesAdicionais: {
                    where: {
                        deleted: false,
                    },
                },
            },
        });
        return findProducts;
    }
}
exports.FetchUserProductsService = FetchUserProductsService;
