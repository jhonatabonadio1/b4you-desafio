"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductController = void 0;
const UpdateProductService_1 = require("../services/UpdateProductService");
class UpdateProductController {
    async handle(request, response) {
        const { id } = request.params;
        const { nome, imageUrl, prestadores, datasDisponiveis, preco, usoMensal, precoCarroGrande, precoCarroPequeno, ativo, opcoesAdicionais, diaResetLimite, exigeVeiculo, } = request.body;
        const updateProductService = new UpdateProductService_1.UpdateProductService();
        const updatedProduct = await updateProductService.execute({
            id,
            nome,
            imageUrl,
            prestadores,
            datasDisponiveis,
            preco,
            usoMensal,
            precoCarroGrande,
            precoCarroPequeno,
            ativo,
            opcoesAdicionais,
            diaResetLimite,
            exigeVeiculo,
        });
        return response.json(updatedProduct);
    }
}
exports.UpdateProductController = UpdateProductController;
