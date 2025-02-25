import { FetchPagesAnalyticsService } from '../../../services/common/tracking/FetchPagesAnalyticsService';
export class FetchPageAnalyticsController {
    async handle(req, res) {
        const { docId } = req.params;
        const { userId } = req;
        const { dataInicio, dataFim } = req.query;
        const service = new FetchPagesAnalyticsService();
        try {
            const analytics = await service.execute(docId, userId, dataInicio, dataFim);
            return res.status(200).json(analytics);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=FetchPagesAnalyticsController.js.map