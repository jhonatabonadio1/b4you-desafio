"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditOptionController = void 0;
const EditOptionService_1 = require("../../../services/common/options/EditOptionService");
class EditOptionController {
    async handle(request, response) {
        const { id } = request.params;
        const { linkId } = request.query;
        const { userId } = request; // Obtido do middleware de autenticação
        const data = request.body;
        try {
            if (!id ||
                !linkId ||
                typeof id !== 'string' ||
                typeof linkId !== 'string') {
                return response.status(400).json({
                    message: 'IDs de propriedade e link são obrigatórios e devem ser strings.',
                });
            }
            const editOptionService = new EditOptionService_1.EditOptionService();
            const result = await editOptionService.execute(userId, id, linkId, data);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.EditOptionController = EditOptionController;
