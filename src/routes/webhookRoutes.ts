import express, { Router } from 'express'

import { StripeWebhookController } from '../controllers/common/stripe/StripeWebhookController'

const webhookRoutes = Router()

const stripeWebhookController = new StripeWebhookController()

webhookRoutes.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookController.handle,
)

export { webhookRoutes }
