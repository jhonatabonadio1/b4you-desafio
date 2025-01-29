"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLocationsController = void 0;
const FetchLocationsService_1 = require("../../../services/admin/locations/FetchLocationsService");
class FetchLocationsController {
    async handle(request, response) {
        try {
            const fetchLocationsService = new FetchLocationsService_1.FetchLocationsService();
            const locations = await fetchLocationsService.execute();
            return response.status(200).json(locations);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchLocationsController = FetchLocationsController;
