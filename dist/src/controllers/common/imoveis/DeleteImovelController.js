"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteImovelController = void 0;
const DeleteImovelService_1 = require("../../../services/common/imoveis/DeleteImovelService");
class DeleteImovelController {
    async handle(request, response) {
        const { id } = request.params;
        const { userId } = request;
        try {
            const deleteImovelService = new DeleteImovelService_1.DeleteImovelService();
            const result = await deleteImovelService.execute(id, userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteImovelController = DeleteImovelController;
