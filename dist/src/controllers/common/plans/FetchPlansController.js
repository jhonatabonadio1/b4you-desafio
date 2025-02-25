import { FetchPlansService } from '../../../services/common/plans/FetchPlansService';
class FetchPlansController {
    async handle(request, response) {
        const fetchPlans = new FetchPlansService();
        try {
            const plans = await fetchPlans.execute();
            return response.status(200).json(plans);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { FetchPlansController };
//# sourceMappingURL=FetchPlansController.js.map