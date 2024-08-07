"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchVehiclesController = void 0;
const FetchVehiclesService_1 = require("../services/FetchVehiclesService");
class FetchVehiclesController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchVehiclesService = new FetchVehiclesService_1.FetchVehiclesService();
        const vehicle = await fetchVehiclesService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(vehicle);
    }
}
exports.FetchVehiclesController = FetchVehiclesController;
