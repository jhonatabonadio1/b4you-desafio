"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicleController = void 0;
const CreateVehicleService_1 = require("../services/CreateVehicleService");
class CreateVehicleController {
    async handle(request, response) {
        const { nome, placa, categoria } = request.body;
        const { userId } = request;
        const createVeiculoService = new CreateVehicleService_1.CreateVehicleService();
        const veiculo = await createVeiculoService.execute({
            nome,
            placa,
            categoria,
            userId,
        });
        return response.json(veiculo);
    }
}
exports.CreateVehicleController = CreateVehicleController;
