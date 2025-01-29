"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePropertyController = void 0;
const DeletePropertyService_1 = require("../../../services/common/properties/DeletePropertyService");
class DeletePropertyController {
    async handle(request, response) {
        const { id } = request.params; // ID da propriedade
        const { userId } = request; // ID do usuário, obtido no middleware de autenticação
        try {
            if (!id || typeof id !== 'string') {
                return response.status(400).json({ message: 'ID inválido.' });
            }
            const deletePropertyService = new DeletePropertyService_1.DeletePropertyService();
            const result = await deletePropertyService.execute(id, userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeletePropertyController = DeletePropertyController;
