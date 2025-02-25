"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPlansController = void 0;
const FetchPlansService_1 = require("../../../services/common/plans/FetchPlansService");
class FetchPlansController {
    async handle(request, response) {
        const fetchPlans = new FetchPlansService_1.FetchPlansService();
        try {
            const plans = await fetchPlans.execute();
            return response.status(200).json(plans);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchPlansController = FetchPlansController;
