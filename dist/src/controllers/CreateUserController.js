"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const CreateUserService_1 = require("../services/CreateUserService");
class CreateUserController {
    async handle(request, response) {
        const { cpf, email, matricula, nome, password, phone, birth } = request.body;
        const createUserService = new CreateUserService_1.CreateUserService();
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
exports.CreateUserController = CreateUserController;
