"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoUserController = void 0;
const DeleteAgendamentoUserService_1 = require("../services/DeleteAgendamentoUserService");
class DeleteAgendamentoUserController {
    async handle(request, response) {
        const { id } = request.params;
        const { userId } = request;
        const deleteUserService = new DeleteAgendamentoUserService_1.DeleteAgendamentoUserService();
        const veiculo = await deleteUserService.execute({
            usuarioId: userId,
            id,
        });
        return response.json(veiculo);
    }
}
exports.DeleteAgendamentoUserController = DeleteAgendamentoUserController;
