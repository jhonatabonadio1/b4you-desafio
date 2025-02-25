"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionController = void 0;
const CreateCheckoutSessionService_1 = require("../../../services/common/stripe/CreateCheckoutSessionService");
class CreateCheckoutSessionController {
    async handle(request, response) {
        const { priceId } = request.body;
        const { userId, ip } = request;
        const createCheckoutSessionService = new CreateCheckoutSessionService_1.CreateCheckoutSessionService();
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
exports.CreateCheckoutSessionController = CreateCheckoutSessionController;
