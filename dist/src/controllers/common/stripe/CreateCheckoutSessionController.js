import { CreateCheckoutSessionService } from '../../../services/common/stripe/CreateCheckoutSessionService';
class CreateCheckoutSessionController {
    async handle(request, response) {
        const { priceId } = request.body;
        const { userId, ip } = request;
        const createCheckoutSessionService = new CreateCheckoutSessionService();
        try {
            const session = await createCheckoutSessionService.execute({
                priceId,
                userId,
                ip,
            });
            return response.status(200).json(session);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { CreateCheckoutSessionController };
//# sourceMappingURL=CreateCheckoutSessionController.js.map