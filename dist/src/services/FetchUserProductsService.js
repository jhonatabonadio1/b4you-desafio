"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserProductsService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserProductsService {
    async execute() {
        const findProducts = await prismaClient_1.prismaClient.servico.findMany({
            where: { ativo: true, deleted: false },
        });
        // Parse do campo opcoesAdicionais para JSON
        const productsWithParsedOptions = findProducts.map((product) => {
            return Object.assign(Object.assign({}, product), { opcoesAdicionais: product.opcoesAdicionais
                    ? JSON.parse(product.opcoesAdicionais)
                    : null });
        });
        return productsWithParsedOptions;
    }
}
exports.FetchUserProductsService = FetchUserProductsService;
