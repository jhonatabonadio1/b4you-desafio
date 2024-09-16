"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoStoreController = void 0;
const DeleteAgendamentoStoreService_1 = require("../services/DeleteAgendamentoStoreService");
class DeleteAgendamentoStoreController {
    async handle(request, response) {
        const { id } = request.params;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = request;
        const deleteUserService = new DeleteAgendamentoStoreService_1.DeleteAgendamentoStoreService();
        const veiculo = await deleteUserService.execute({
            usuarioId: userId,
            id,
        });
        return response.json(veiculo);
    }
}
exports.DeleteAgendamentoStoreController = DeleteAgendamentoStoreController;
