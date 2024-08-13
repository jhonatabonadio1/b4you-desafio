"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductPrestadoresController = void 0;
const FetchProductPrestadoresService_1 = require("../services/FetchProductPrestadoresService");
class FetchProductPrestadoresController {
    async handle(request, response) {
        const { produtoId } = request.params;
        const fetchProdutosService = new FetchProductPrestadoresService_1.FetchProductPrestadoresService();
        const produto = await fetchProdutosService.execute({
            produtoId,
        });
        return response.json(produto);
    }
}
exports.FetchProductPrestadoresController = FetchProductPrestadoresController;
