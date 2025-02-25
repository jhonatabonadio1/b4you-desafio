"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchHeatmapsController = void 0;
const FetchHeatmapsService_1 = require("../../../services/common/heatmaps/FetchHeatmapsService");
class FetchHeatmapsController {
    async handle(request, response) {
        const { docId, page } = request.params;
        const { userId } = request;
        const fetchHeatmapsService = new FetchHeatmapsService_1.FetchHeatmapsService();
        try {
            const heatmaps = await fetchHeatmapsService.execute({
                docId,
                page: parseFloat(page),
                userId,
            });
            return response.status(201).json(heatmaps);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchHeatmapsController = FetchHeatmapsController;
