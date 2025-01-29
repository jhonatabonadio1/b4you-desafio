"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePropertyController = void 0;
const UpdatePropertyService_1 = require("../../../services/common/properties/UpdatePropertyService");
class UpdatePropertyController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { propertyId } = request.query;
        const { propertyType, quartos, banheiros, garagem, paymentMethod, descricao, state, cidades, metragens, valores, nome, details, condominium, encaminhado, linkImovel, fonte, } = request.body;
        try {
            const updatePropertyService = new UpdatePropertyService_1.UpdatePropertyService();
            const updatedProperty = await updatePropertyService.execute({
                propertyId: propertyId,
                propertyType,
                quartos: parseInt(quartos, 10),
                banheiros: parseInt(banheiros, 10),
                garagem: parseInt(garagem, 10),
                paymentMethod,
                descricao,
                state,
                cidades,
                metragens,
                valores,
                nome,
                details,
                condominium,
                encaminhado,
                linkImovel,
                fonte,
                userId,
            });
            return response.status(200).json({
                message: 'Propriedade atualizada com sucesso',
                updatedProperty,
            });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdatePropertyController = UpdatePropertyController;
