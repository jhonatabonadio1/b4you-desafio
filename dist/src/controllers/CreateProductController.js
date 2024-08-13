"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductController = void 0;
const CreateProductService_1 = require("../services/CreateProductService");
class CreateProductController {
    async handle(request, response) {
        const { nome, imageUrl, prestadores, datasDisponiveis, preco, precoCarroGrande, precoCarroPequeno, ativo, opcoesAdicionais, exigeVeiculo, } = request.body;
        const createProductService = new CreateProductService_1.CreateProductService();
        const product = await createProductService.execute({
            nome,
            imageUrl,
            prestadores,
            datasDisponiveis,
            preco,
            precoCarroGrande,
            precoCarroPequeno,
            ativo,
            opcoesAdicionais,
            exigeVeiculo,
        });
        return response.json(product);
    }
}
exports.CreateProductController = CreateProductController;
