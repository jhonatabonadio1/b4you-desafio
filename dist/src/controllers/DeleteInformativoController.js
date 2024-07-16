"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteInformativoController = void 0;
const DeleteInformativoService_1 = require("../services/DeleteInformativoService");
class DeleteInformativoController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteInformativoService = new DeleteInformativoService_1.DeleteInformativoService();
        const informativo = await deleteInformativoService.execute({
            id,
        });
        return response.json(informativo);
    }
}
exports.DeleteInformativoController = DeleteInformativoController;
