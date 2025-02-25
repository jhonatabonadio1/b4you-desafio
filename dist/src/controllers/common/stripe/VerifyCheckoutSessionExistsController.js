import { VerifyCheckoutSessionExistsService } from '../../../services/common/stripe/VerifyCheckoutSessionExistsService';
class VerifyCheckoutSessionExistsController {
    async handle(request, response) {
        const { sessionId } = request.params;
        const { userId } = request;
        const verifyCheckoutSessionExistsService = new VerifyCheckoutSessionExistsService();
        try {
            const session = await verifyCheckoutSessionExistsService.execute({
                sessionId,
                userId,
            });
            return response.status(200).json(session);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { VerifyCheckoutSessionExistsController };
//# sourceMappingURL=VerifyCheckoutSessionExistsController.js.map