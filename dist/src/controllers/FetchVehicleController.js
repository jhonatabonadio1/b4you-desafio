"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchVehicleController = void 0;
const FetchVehicleService_1 = require("../services/FetchVehicleService");
class FetchVehicleController {
    async handle(request, response) {
        const { vehicleId } = request.params;
        const fetchUserConveniosService = new FetchVehicleService_1.FetchVehicleService();
        const vehicle = await fetchUserConveniosService.execute({
            vehicleId,
        });
        return response.json(vehicle);
    }
}
exports.FetchVehicleController = FetchVehicleController;
