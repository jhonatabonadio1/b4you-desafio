"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const UpdateUserService_1 = require("../../../services/admin/users/UpdateUserService");
class UpdateUserController {
    async handle(request, response) {
        const { id } = request.query;
        const { email, nome, role, password } = request.body;
        try {
            const updateUserService = new UpdateUserService_1.UpdateUserService();
            const updatedUser = await updateUserService.execute(id, {
                email,
                nome,
                role,
                password,
            });
            return response.status(200).json(updatedUser);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdateUserController = UpdateUserController;
