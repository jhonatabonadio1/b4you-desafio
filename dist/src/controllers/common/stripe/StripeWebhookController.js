"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const StripeWebhookService_1 = require("../../../services/common/stripe/StripeWebhookService");
const stripe_1 = require("../../../lib/stripe");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class StripeWebhookController {
    async handle(request, response) {
        const sig = request.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;
        try {
            event = request.body;
            // Se necessário, validar o evento (requer Stripe Secret)
            if (sig) {
                event = stripe_1.stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
            }
        }
        catch (error) {
            return response
                .status(400)
                .json({ error: `Webhook Error: ${error.message}` });
        }
        const stripeWebhookService = new StripeWebhookService_1.StripeWebhookService();
        try {
            const result = await stripeWebhookService.execute({ event });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.StripeWebhookController = StripeWebhookController;
//# sourceMappingURL=StripeWebhookController.js.map