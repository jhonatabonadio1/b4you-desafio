"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendamentoController = void 0;
const DeleteAgendamentoService_1 = require("../services/DeleteAgendamentoService");
class DeleteAgendamentoController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteUserService = new DeleteAgendamentoService_1.DeleteAgendamentoService();
        const veiculo = await deleteUserService.execute({
            id,
        });
        return response.json(veiculo);
    }
}
exports.DeleteAgendamentoController = DeleteAgendamentoController;
