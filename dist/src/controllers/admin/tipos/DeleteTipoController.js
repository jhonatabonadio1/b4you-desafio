"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTipoController = void 0;
const DeleteTipoService_1 = require("../../../services/admin/tipos/DeleteTipoService");
class DeleteTipoController {
    async handle(request, response) {
        const { id } = request.body;
        try {
            const deleteTipoService = new DeleteTipoService_1.DeleteTipoService();
            const result = await deleteTipoService.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteTipoController = DeleteTipoController;
