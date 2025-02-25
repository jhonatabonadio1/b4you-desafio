import { CaptureHeatmapsService } from '../../../services/common/heatmaps/CaptureHeatmapsService';
class CaptureHeatmapsController {
    async handle(request, response) {
        const { docId, lote, sessionId } = request.body;
        const createHeatmapsService = new CaptureHeatmapsService();
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
export { CaptureHeatmapsController };
//# sourceMappingURL=CaptureHeatmapsController.js.map