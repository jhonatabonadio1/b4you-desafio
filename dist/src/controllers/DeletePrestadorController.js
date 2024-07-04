"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrestadorController = void 0;
const DeletePrestadorService_1 = require("../services/DeletePrestadorService");
class DeletePrestadorController {
    async handle(request, response) {
        const { prestadorId } = request.params;
        const deletePrestadorService = new DeletePrestadorService_1.DeletePrestadorService();
        const user = await deletePrestadorService.execute({
            prestadorId,
        });
        return response.json(user);
    }
}
exports.DeletePrestadorController = DeletePrestadorController;
