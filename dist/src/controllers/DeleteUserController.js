"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserController = void 0;
const DeleteUserService_1 = require("../services/DeleteUserService");
class DeleteUserController {
    async handle(request, response) {
        const { usuarioId } = request.params;
        const deleteUserService = new DeleteUserService_1.DeleteUserService();
        const user = await deleteUserService.execute({
            usuarioId,
        });
        return response.json(user);
    }
}
exports.DeleteUserController = DeleteUserController;
