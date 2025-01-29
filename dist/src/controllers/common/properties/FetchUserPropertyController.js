"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserPropertyController = void 0;
const FetchUserPropertyService_1 = require("../../../services/common/properties/FetchUserPropertyService");
class FetchUserPropertyController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { propertyId } = request.query;
        try {
            if (!propertyId || typeof propertyId !== 'string') {
                return response
                    .status(400)
                    .json({ message: 'ID da propriedade inválido.' });
            }
            const fetchUserPropertyService = new FetchUserPropertyService_1.FetchUserPropertyService();
            const property = await fetchUserPropertyService.execute(userId, propertyId);
            return response.status(200).json(property);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUserPropertyController = FetchUserPropertyController;
