"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserImovelController = void 0;
const FetchUserImovelService_1 = require("../../../services/common/imoveis/FetchUserImovelService");
class FetchUserImovelController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { imovelId } = request.query;
        try {
            if (!imovelId || typeof imovelId !== 'string') {
                return response.status(400).json({ message: 'ID do imóvel inválido.' });
            }
            const fetchUserImovelService = new FetchUserImovelService_1.FetchUserImovelService();
            const property = await fetchUserImovelService.execute(userId, imovelId);
            return response.status(200).json(property);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUserImovelController = FetchUserImovelController;
