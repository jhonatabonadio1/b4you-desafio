"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserCargaController = void 0;
const CreateUserCargaService_1 = require("../services/CreateUserCargaService");
class CreateUserCargaController {
    async handle(request, response) {
        const { cpf, email, matricula, nome, password, phone, birth } = request.body;
        const createUserService = new CreateUserCargaService_1.CreateUserCargaService();
        const user = await createUserService.execute({
            cpf,
            email,
            matricula,
            nome,
            password,
            phone,
            birth,
        });
        return response.json(user);
    }
}
exports.CreateUserCargaController = CreateUserCargaController;
