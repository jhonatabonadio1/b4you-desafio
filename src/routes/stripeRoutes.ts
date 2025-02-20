import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { CreateCheckoutSessionController } from '../controllers/common/stripe/CreateCheckoutSessionController'
import { VerifyCheckoutSessionExistsController } from '../controllers/common/stripe/VerifyCheckoutSessionExistsController'

const stripeRoutes = Router()

const createCheckoutSessionController = new CreateCheckoutSessionController()
const verifyCheckoutSessionExistsController =
  new VerifyCheckoutSessionExistsController()

stripeRoutes.post(
  '/stripe/create-checkout',
  ensureAuthenticated,
  createCheckoutSessionController.handle,
)
stripeRoutes.get(
  '/stripe/session/:sessionId',
  ensureAuthenticated,
  verifyCheckoutSessionExistsController.handle,
)

export { stripeRoutes }
