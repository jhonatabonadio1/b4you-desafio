"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminUserVehiclesController = void 0;
const FetchAdminUserVehiclesService_1 = require("../services/FetchAdminUserVehiclesService");
class FetchAdminUserVehiclesController {
    async handle(request, response) {
        const { userId } = request.params;
        const fetchVehicles = new FetchAdminUserVehiclesService_1.FetchAdminUserVehiclesService();
        const vehicles = await fetchVehicles.execute({
            userId,
        });
        return response.json(vehicles);
    }
}
exports.FetchAdminUserVehiclesController = FetchAdminUserVehiclesController;
