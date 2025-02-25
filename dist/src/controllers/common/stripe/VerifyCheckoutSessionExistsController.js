"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCheckoutSessionExistsController = void 0;
const VerifyCheckoutSessionExistsService_1 = require("../../../services/common/stripe/VerifyCheckoutSessionExistsService");
class VerifyCheckoutSessionExistsController {
    async handle(request, response) {
        const { sessionId } = request.params;
        const { userId } = request;
        const verifyCheckoutSessionExistsService = new VerifyCheckoutSessionExistsService_1.VerifyCheckoutSessionExistsService();
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
exports.VerifyCheckoutSessionExistsController = VerifyCheckoutSessionExistsController;
