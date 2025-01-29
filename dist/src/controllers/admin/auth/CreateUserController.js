"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const CreateUserService_1 = require("../../../services/admin/auth/CreateUserService");
class CreateUserController {
    async handle(request, response) {
        var _a;
        const { email, password, nome, role } = request.body;
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const createUserService = new CreateUserService_1.CreateUserService();
        try {
            const result = await createUserService.execute({
                email,
                password,
                nome,
                role,
                token,
            });
            return response.status(201).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateUserController = CreateUserController;
