/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { StripeWebhookService } from '../../../services/common/stripe/StripeWebhookService'
import { stripe } from '../../../lib/stripe'
import dotenv from 'dotenv'

dotenv.config()

class StripeWebhookController {
  async handle(request: Request, response: Response) {
    const sig = request.headers['stripe-signature']
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event

    try {
      event = request.body

      // Se necessário, validar o evento (requer Stripe Secret)
      if (sig) {
        event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret)
      }
    } catch (error: any) {
      return response
        .status(400)
        .json({ error: `Webhook Error: ${error.message}` })
    }

    const stripeWebhookService = new StripeWebhookService()

    try {
      const result = await stripeWebhookService.execute({ event })
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { StripeWebhookController }
