"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPlansAuthController = void 0;
const FetchPlansAuthService_1 = require("../../../services/common/plans/FetchPlansAuthService");
class FetchPlansAuthController {
    async handle(request, response) {
        const { userId } = request;
        const fetchPlans = new FetchPlansAuthService_1.FetchPlansAuthService();
        try {
            const plans = await fetchPlans.execute(userId);
            return response.status(200).json(plans);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchPlansAuthController = FetchPlansAuthController;
