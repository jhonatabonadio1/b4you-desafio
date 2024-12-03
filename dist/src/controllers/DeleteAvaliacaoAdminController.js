"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAvaliacaoAdminController = void 0;
const DeleteAvaliacaoAdminService_1 = require("../services/DeleteAvaliacaoAdminService");
class DeleteAvaliacaoAdminController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteAvaliacao = new DeleteAvaliacaoAdminService_1.DeleteAvaliacaoAdminService();
        const avaliacao = await deleteAvaliacao.execute({
            id,
        });
        return response.json(avaliacao);
    }
}
exports.DeleteAvaliacaoAdminController = DeleteAvaliacaoAdminController;
