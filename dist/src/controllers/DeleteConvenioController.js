"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteConvenioController = void 0;
const DeleteConvenioService_1 = require("../services/DeleteConvenioService");
class DeleteConvenioController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteConvenioService = new DeleteConvenioService_1.DeleteConvenioService();
        const convenio = await deleteConvenioService.execute({
            id,
        });
        return response.json(convenio);
    }
}
exports.DeleteConvenioController = DeleteConvenioController;
