import express, { Router } from 'express'

import { StripeWebhookController } from '../controllers/common/stripe/StripeWebhookController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const webhookRoutes = Router()

const stripeWebhookController = new StripeWebhookController()

webhookRoutes.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  userInBlacklist,
  stripeWebhookController.handle,
)

export { webhookRoutes }
