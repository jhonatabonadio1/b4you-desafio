"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrestadorController = void 0;
const CreatePrestadorService_1 = require("../services/CreatePrestadorService");
class CreatePrestadorController {
    async handle(request, response) {
        const { bairro, cep, cidade, endereco, estado, inscricao, latitude, longitude, password, razaoSocial, tipoInscricao, email, } = request.body;
        const createPrestadorService = new CreatePrestadorService_1.CreatePrestadorService();
        const user = await createPrestadorService.execute({
            bairro,
            cep,
            cidade,
            endereco,
            estado,
            inscricao,
            latitude,
            longitude,
            password,
            razaoSocial,
            tipoInscricao,
            email,
        });
        return response.json(user);
    }
}
exports.CreatePrestadorController = CreatePrestadorController;
