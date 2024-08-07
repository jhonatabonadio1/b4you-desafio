"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserVehiclesController = void 0;
const FetchUserVehiclesService_1 = require("../services/FetchUserVehiclesService");
class FetchUserVehiclesController {
    async handle(request, response) {
        const { userId } = request;
        const fetchVehiclesService = new FetchUserVehiclesService_1.FetchUserVehiclesService();
        const vehicle = await fetchVehiclesService.execute({
            userId,
        });
        return response.json(vehicle);
    }
}
exports.FetchUserVehiclesController = FetchUserVehiclesController;
