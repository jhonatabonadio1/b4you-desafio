"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImovelController = void 0;
const UpdateImovelService_1 = require("../../../services/common/imoveis/UpdateImovelService");
class UpdateImovelController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { id } = request.query;
        const { propertyType, quartos, banheiros, garagem, descricao, state, cidade, valor, valorCondo, metragens, images, valorComissao, details, condominium, ownerName, ownerPhone, ownerEmail, ownerWhatsapp, } = request.body;
        try {
            const updateImovelService = new UpdateImovelService_1.UpdateImovelService();
            const updatedProperty = await updateImovelService.execute({
                _id: id,
                propertyType,
                quartos: parseInt(quartos, 10),
                banheiros: parseInt(banheiros, 10),
                garagem: parseInt(garagem, 10),
                descricao,
                state,
                cidade,
                valor,
                valorCondo,
                metragens,
                images,
                valorComissao,
                details,
                condominium,
                ownerName,
                ownerPhone,
                ownerEmail,
                ownerWhatsapp,
                userId,
            });
            return response
                .status(200)
                .json({ message: 'Imóvel atualizado com sucesso', updatedProperty });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdateImovelController = UpdateImovelController;
