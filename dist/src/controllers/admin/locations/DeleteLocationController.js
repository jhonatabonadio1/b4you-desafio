"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLocationController = void 0;
const DeleteLocationService_1 = require("../../../services/admin/locations/DeleteLocationService");
class DeleteLocationController {
    async handle(request, response) {
        const { sigla, cidade } = request.body;
        try {
            const deleteLocationService = new DeleteLocationService_1.DeleteLocationService();
            const result = await deleteLocationService.execute(sigla, cidade);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteLocationController = DeleteLocationController;
