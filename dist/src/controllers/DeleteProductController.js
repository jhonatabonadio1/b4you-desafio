"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductController = void 0;
const DeleteProductService_1 = require("../services/DeleteProductService");
class DeleteProductController {
    async handle(request, response) {
        const { produtoId } = request.params;
        const deleteProdutoService = new DeleteProductService_1.DeleteProductService();
        const user = await deleteProdutoService.execute({
            produtoId,
        });
        return response.json(user);
    }
}
exports.DeleteProductController = DeleteProductController;
