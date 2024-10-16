"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCargaController = void 0;
const DeleteCargaService_1 = require("../services/DeleteCargaService");
class DeleteCargaController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteCargaService = new DeleteCargaService_1.DeleteCargaService();
        const convenio = await deleteCargaService.execute({
            id,
        });
        return response.json(convenio);
    }
}
exports.DeleteCargaController = DeleteCargaController;
