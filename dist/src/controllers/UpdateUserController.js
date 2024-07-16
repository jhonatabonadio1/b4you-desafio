"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const UpdateUserService_1 = require("../services/UpdateUserService");
class UpdateUserController {
    async handle(request, response) {
        const { usuarioId } = request.params;
        const { matricula, email, cpf, phone, password, birth, nome, tipoAcesso } = request.body;
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        const user = await updateUserService.execute({
            usuarioId,
            matricula,
            cpf,
            phone,
            birth,
            nome,
            tipoAcesso,
            password,
            email,
        });
        return response.json(user);
    }
}
exports.UpdateUserController = UpdateUserController;
