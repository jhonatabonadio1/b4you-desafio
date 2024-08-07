"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserVehicleController = void 0;
const DeleteUserVehicleService_1 = require("../services/DeleteUserVehicleService");
class DeleteUserVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const { userId } = request;
        const deleteUserService = new DeleteUserVehicleService_1.DeleteUserVehicleService();
        const veiculo = await deleteUserService.execute({
            userId,
            vehicleId,
        });
        return response.json(veiculo);
    }
}
exports.DeleteUserVehicleController = DeleteUserVehicleController;
