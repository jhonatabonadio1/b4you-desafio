"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrestadorHorariosController = void 0;
const DeletePrestadorHorariosService_1 = require("../services/DeletePrestadorHorariosService");
class DeletePrestadorHorariosController {
    async handle(request, response) {
        const { userId } = request;
        const { data } = request.body;
        const deletePrestadorHorariosService = new DeletePrestadorHorariosService_1.DeletePrestadorHorariosService();
        const user = await deletePrestadorHorariosService.execute({
            prestadorId: userId,
            data,
        });
        return response.json(user);
    }
}
exports.DeletePrestadorHorariosController = DeletePrestadorHorariosController;
