"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductController = void 0;
const CreateProductService_1 = require("../services/CreateProductService");
class CreateProductController {
    async handle(request, response) {
        const { file } = request;
        const { nome, prestadores, datasDisponiveis, preco, usoMensal, precoCarroGrande, precoCarroPequeno, ativo, opcoesAdicionais, diaResetLimite, exigeVeiculo, } = request.body;
        const createProductService = new CreateProductService_1.CreateProductService();
        const product = await createProductService.execute({
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
        return response.json(product);
    }
}
exports.CreateProductController = CreateProductController;
