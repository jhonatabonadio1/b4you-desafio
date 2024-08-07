"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserVehicleController = void 0;
const FetchUserVehicleService_1 = require("../services/FetchUserVehicleService");
class FetchUserVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const { userId } = request;
        const fetchUserConveniosService = new FetchUserVehicleService_1.FetchUserVehicleService();
        const vehicle = await fetchUserConveniosService.execute({
            vehicleId,
            userId,
        });
        return response.json(vehicle);
    }
}
exports.FetchUserVehicleController = FetchUserVehicleController;
