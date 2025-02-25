"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchDocumentTrackingController = void 0;
const FetchDocumentTrackingService_1 = require("../../../services/common/tracking/FetchDocumentTrackingService");
class FetchDocumentTrackingController {
    async handle(request, response) {
        const fetchDocumentTrackingService = new FetchDocumentTrackingService_1.FetchDocumentTrackingService();
        const { docId } = request.params;
        const { userId } = request;
        const { dataInicio, dataFim } = request.query;
        try {
            const tracking = await fetchDocumentTrackingService.execute(docId, userId, dataInicio, dataFim);
            return response.status(200).json(tracking);
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
}
exports.FetchDocumentTrackingController = FetchDocumentTrackingController;
//# sourceMappingURL=FetchDocumentTrackingController.js.map