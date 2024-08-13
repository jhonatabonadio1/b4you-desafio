"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductsController = void 0;
const FetchProductsService_1 = require("../services/FetchProductsService");
class FetchProductsController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchProdutosService = new FetchProductsService_1.FetchProductsService();
        const produto = await fetchProdutosService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(produto);
    }
}
exports.FetchProductsController = FetchProductsController;
