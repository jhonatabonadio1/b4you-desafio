"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserVehicleController = void 0;
const UpdateUserVehicleService_1 = require("../services/UpdateUserVehicleService");
class UpdateUserVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const { categoria, nome, placa } = request.body;
        const { userId } = request;
        const updateVehicleService = new UpdateUserVehicleService_1.UpdateUserVehicleService();
        const veiculo = await updateVehicleService.execute({
            vehicleId,
            userId,
            categoria,
            nome,
            placa,
        });
        return response.json(veiculo);
    }
}
exports.UpdateUserVehicleController = UpdateUserVehicleController;
