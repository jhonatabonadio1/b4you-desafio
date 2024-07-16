"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBrindeController = void 0;
const CreateBrindeService_1 = require("../services/CreateBrindeService");
class CreateBrindeController {
    async handle(request, response) {
        const { titulo, texto, dataDisponibilidade, dataLimite, prestadores, todosPrestadores, todosUsuarios, usuarios, imageUrl, ativo, } = request.body;
        const createBrindeService = new CreateBrindeService_1.CreateBrindeService();
        const brinde = await createBrindeService.execute({
            titulo,
            texto,
            dataDisponibilidade,
            dataLimite,
            prestadores,
            todosPrestadores,
            todosUsuarios,
            usuarios,
            imageUrl,
            ativo,
        });
        return response.json(brinde);
    }
}
exports.CreateBrindeController = CreateBrindeController;
