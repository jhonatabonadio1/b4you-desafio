"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPageAnalyticsController = void 0;
const FetchPagesAnalyticsService_1 = require("../../../services/common/tracking/FetchPagesAnalyticsService");
class FetchPageAnalyticsController {
    async handle(req, res) {
        const { docId } = req.params;
        const { userId } = req;
        const { dataInicio, dataFim } = req.query;
        const service = new FetchPagesAnalyticsService_1.FetchPagesAnalyticsService();
        try {
            const analytics = await service.execute(docId, userId, dataInicio, dataFim);
            return res.status(200).json(analytics);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.FetchPageAnalyticsController = FetchPageAnalyticsController;
