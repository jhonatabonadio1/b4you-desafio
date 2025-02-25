"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const CreateUserService_1 = require("../../../services/common/users/CreateUserService");
const prismaClient_1 = require("../../../database/prismaClient");
class CreateUserController {
    async handle(request, response) {
        const { email, password, firstName, lastName, empresa } = request.body;
        const verificaEmailBlacklist = await prismaClient_1.prismaClient.blacklist.findFirst({
            where: { OR: [{ email }, { empresa }] },
        });
        if (verificaEmailBlacklist) {
            return response
                .status(401)
                .json({ error: 'Usuário bloqueado no sistema.' });
        }
        const createUserService = new CreateUserService_1.CreateUserService();
        try {
            const user = await createUserService.execute({
                email,
                password,
                firstName,
                lastName,
                empresa,
            });
            return response.status(201).json(user);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateUserController = CreateUserController;
//# sourceMappingURL=CreateUserController.js.map