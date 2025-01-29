"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserImoveisController = void 0;
const FetchUserImoveisService_1 = require("../../../services/common/imoveis/FetchUserImoveisService");
class FetchUserImoveisController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        try {
            const fetchUserImoveisService = new FetchUserImoveisService_1.FetchUserImoveisService();
            const properties = await fetchUserImoveisService.execute(userId);
            return response.status(200).json(properties);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUserImoveisController = FetchUserImoveisController;
