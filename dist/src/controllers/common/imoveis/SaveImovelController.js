"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveImovelController = void 0;
const SaveImovelService_1 = require("../../../services/common/imoveis/SaveImovelService");
class SaveImovelController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { propertyType, quartos, banheiros, garagem, descricao, state, cidade, valor, valorCondo, metragens, images, details, condominium, valorComissao, ownerName, ownerPhone, ownerEmail, ownerWhatsapp, } = request.body;
        try {
            const saveImovelService = new SaveImovelService_1.SaveImovelService();
            const property = await saveImovelService.execute({
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
                details,
                condominium,
                valorComissao,
                ownerName,
                ownerPhone,
                ownerEmail,
                ownerWhatsapp,
                userId,
            });
            return response
                .status(201)
                .json({ message: 'Imóvel salvo com sucesso', property });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SaveImovelController = SaveImovelController;
