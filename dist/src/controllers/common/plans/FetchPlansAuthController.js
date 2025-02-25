import { FetchPlansAuthService } from '../../../services/common/plans/FetchPlansAuthService';
class FetchPlansAuthController {
    async handle(request, response) {
        const { userId } = request;
        const fetchPlans = new FetchPlansAuthService();
        try {
            const plans = await fetchPlans.execute(userId);
            return response.status(200).json(plans);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { FetchPlansAuthController };
//# sourceMappingURL=FetchPlansAuthController.js.map