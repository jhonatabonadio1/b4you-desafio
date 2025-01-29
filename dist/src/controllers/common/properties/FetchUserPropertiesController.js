"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserPropertiesController = void 0;
const FetchUserPropertiesService_1 = require("../../../services/common/properties/FetchUserPropertiesService");
class FetchUserPropertiesController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        try {
            const fetchUserPropertiesService = new FetchUserPropertiesService_1.FetchUserPropertiesService();
            const properties = await fetchUserPropertiesService.execute(userId);
            return response.status(200).json(properties);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUserPropertiesController = FetchUserPropertiesController;
