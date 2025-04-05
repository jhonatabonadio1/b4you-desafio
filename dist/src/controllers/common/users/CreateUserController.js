"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const CreateUserService_1 = require("../../../services/common/users/CreateUserService");
class CreateUserController {
    async handle(request, response) {
        const { email, password, firstName, lastName } = request.body;
        const createUserService = new CreateUserService_1.CreateUserService();
        try {
            const user = await createUserService.execute({
                email,
                password,
                firstName,
                lastName,
            });
            return response.status(201).json(user);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateUserController = CreateUserController;
