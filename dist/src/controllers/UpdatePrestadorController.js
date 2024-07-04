"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrestadorController = void 0;
const UpdatePrestadorService_1 = require("../services/UpdatePrestadorService");
class UpdatePrestadorController {
    async handle(request, response) {
        const { prestadorId } = request.params;
        const { bairro, cep, cidade, endereco, estado, inscricao, latitude, longitude, password, razaoSocial, tipoInscricao, email, } = request.body;
        const updatePrestadorService = new UpdatePrestadorService_1.UpdatePrestadorService();
        const user = await updatePrestadorService.execute({
            prestadorId,
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
exports.UpdatePrestadorController = UpdatePrestadorController;
