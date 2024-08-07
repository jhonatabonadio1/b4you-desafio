"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleController = void 0;
const UpdateVehicleService_1 = require("../services/UpdateVehicleService");
class UpdateVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const { categoria, nome, placa } = request.body;
        const updateVehicleService = new UpdateVehicleService_1.UpdateVehicleService();
        const veiculo = await updateVehicleService.execute({
            vehicleId,
            categoria,
            nome,
            placa,
        });
        return response.json(veiculo);
    }
}
exports.UpdateVehicleController = UpdateVehicleController;
