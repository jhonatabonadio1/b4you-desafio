"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductController = void 0;
const UpdateProductService_1 = require("../services/UpdateProductService");
class UpdateProductController {
    async handle(request, response) {
        const { file } = request;
        const { id } = request.params;
        const { nome, prestadores, datasDisponiveis, preco, usoMensal, precoCarroGrande, precoCarroPequeno, ativo, opcoesAdicionais, diaResetLimite, exigeVeiculo, } = request.body;
        const updateProductService = new UpdateProductService_1.UpdateProductService();
        const updatedProduct = await updateProductService.execute({
            id,
            nome,
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            filePath: file === null || file === void 0 ? void 0 : file.path,
            prestadores: prestadores ? JSON.parse(prestadores) : [],
            datasDisponiveis: datasDisponiveis ? JSON.parse(datasDisponiveis) : [],
            preco,
            usoMensal: Number(usoMensal),
            precoCarroGrande,
            precoCarroPequeno,
            ativo: ativo === 'true',
            opcoesAdicionais: opcoesAdicionais ? JSON.parse(opcoesAdicionais) : [],
            diaResetLimite: Number(diaResetLimite),
            exigeVeiculo: exigeVeiculo === 'true',
        });
        return response.json(updatedProduct);
    }
}
exports.UpdateProductController = UpdateProductController;
