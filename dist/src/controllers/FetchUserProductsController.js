"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserProductsController = void 0;
const FetchUserProductsService_1 = require("../services/FetchUserProductsService");
class FetchUserProductsController {
    async handle(request, response) {
        const fetchProductsService = new FetchUserProductsService_1.FetchUserProductsService();
        const product = await fetchProductsService.execute();
        return response.json(product);
    }
}
exports.FetchUserProductsController = FetchUserProductsController;
