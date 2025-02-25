import { FetchHeatmapsService } from '../../../services/common/heatmaps/FetchHeatmapsService';
class FetchHeatmapsController {
    async handle(request, response) {
        const { docId, page } = request.params;
        const { userId } = request;
        const fetchHeatmapsService = new FetchHeatmapsService();
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
export { FetchHeatmapsController };
//# sourceMappingURL=FetchHeatmapsController.js.map