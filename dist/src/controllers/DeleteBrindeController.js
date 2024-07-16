"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBrindeController = void 0;
const DeleteBrindeService_1 = require("../services/DeleteBrindeService");
class DeleteBrindeController {
    async handle(request, response) {
        const { id } = request.params;
        const deleteBrindeService = new DeleteBrindeService_1.DeleteBrindeService();
        const brinde = await deleteBrindeService.execute({
            id,
        });
        return response.json(brinde);
    }
}
exports.DeleteBrindeController = DeleteBrindeController;
