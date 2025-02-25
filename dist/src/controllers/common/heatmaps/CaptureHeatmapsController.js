"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureHeatmapsController = void 0;
const CaptureHeatmapsService_1 = require("../../../services/common/heatmaps/CaptureHeatmapsService");
class CaptureHeatmapsController {
    async handle(request, response) {
        const { docId, lote, sessionId } = request.body;
        const createHeatmapsService = new CaptureHeatmapsService_1.CaptureHeatmapsService();
        try {
            const heatmaps = await createHeatmapsService.execute({
                docId,
                lote,
                sessionId,
            });
            return response.status(201).json(heatmaps);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CaptureHeatmapsController = CaptureHeatmapsController;
