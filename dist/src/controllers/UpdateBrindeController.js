"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBrindeController = void 0;
const UpdateBrindeService_1 = require("../services/UpdateBrindeService");
class UpdateBrindeController {
    async handle(request, response) {
        const { titulo, imageUrl, texto, dataDisponibilidade, dataLimite, usuarios, prestadores, todosPrestadores, todosUsuarios, ativo, } = request.body;
        const { id } = request.params;
        const updateBrindeService = new UpdateBrindeService_1.UpdateBrindeService();
        const brinde = await updateBrindeService.execute({
            id,
            titulo,
            imageUrl,
            texto,
            dataDisponibilidade,
            dataLimite,
            usuarios,
            prestadores,
            todosPrestadores,
            todosUsuarios,
            ativo,
        });
        return response.json(brinde);
    }
}
exports.UpdateBrindeController = UpdateBrindeController;
