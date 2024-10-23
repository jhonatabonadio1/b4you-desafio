"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrestadorHorariosController = void 0;
const CreatePrestadorHorariosService_1 = require("../services/CreatePrestadorHorariosService");
class CreatePrestadorHorariosController {
    async handle(request, response) {
        const { userId } = request;
        const { data } = request.body;
        const createPrestadorHorariosService = new CreatePrestadorHorariosService_1.CreatePrestadorHorariosService();
        const user = await createPrestadorHorariosService.execute({
            prestadorId: userId,
            data,
        });
        return response.json(user);
    }
}
exports.CreatePrestadorHorariosController = CreatePrestadorHorariosController;
