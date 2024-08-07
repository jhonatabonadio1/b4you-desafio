"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVehicleController = void 0;
const DeleteVehicleService_1 = require("../services/DeleteVehicleService");
class DeleteVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const deleteUserService = new DeleteVehicleService_1.DeleteVehicleService();
        const veiculo = await deleteUserService.execute({
            vehicleId,
        });
        return response.json(veiculo);
    }
}
exports.DeleteVehicleController = DeleteVehicleController;
