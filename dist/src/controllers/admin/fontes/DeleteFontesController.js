"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFontesController = void 0;
const DeleteFonteService_1 = require("../../../services/admin/fontes/DeleteFonteService");
class DeleteFontesController {
    async handle(request, response) {
        const { id } = request.body;
        try {
            const deleteFontesService = new DeleteFonteService_1.DeleteFonteService();
            const result = await deleteFontesService.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteFontesController = DeleteFontesController;
