"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavePropertyController = void 0;
const SavePropertyService_1 = require("../../../services/common/properties/SavePropertyService");
class SavePropertyController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { propertyType, quartos, banheiros, garagem, paymentMethod, descricao, state, cidades, metragens, valores, nome, details, condominium, } = request.body;
        try {
            const savePropertyService = new SavePropertyService_1.SavePropertyService();
            const property = await savePropertyService.execute({
                propertyType,
                quartos: parseInt(quartos.toString(), 10),
                banheiros: parseInt(banheiros.toString(), 10),
                garagem: parseInt(garagem.toString(), 10),
                paymentMethod,
                descricao,
                state,
                cidades,
                metragens,
                valores,
                nome,
                details,
                condominium,
                userId,
            });
            return response
                .status(201)
                .json({ message: 'Propriedade salva com sucesso', property });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SavePropertyController = SavePropertyController;
