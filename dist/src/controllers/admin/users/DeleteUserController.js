"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserController = void 0;
const DeleteUserService_1 = require("../../../services/admin/users/DeleteUserService");
class DeleteUserController {
    async handle(request, response) {
        const { id } = request.query;
        try {
            const deleteUserService = new DeleteUserService_1.DeleteUserService();
            const result = await deleteUserService.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteUserController = DeleteUserController;
