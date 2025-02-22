import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { CreateCheckoutSessionController } from '../controllers/common/stripe/CreateCheckoutSessionController'
import { VerifyCheckoutSessionExistsController } from '../controllers/common/stripe/VerifyCheckoutSessionExistsController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const stripeRoutes = Router()

const createCheckoutSessionController = new CreateCheckoutSessionController()
const verifyCheckoutSessionExistsController =
  new VerifyCheckoutSessionExistsController()

stripeRoutes.post(
  '/stripe/create-checkout',
  ensureAuthenticated,
  userInBlacklist,
  createCheckoutSessionController.handle,
)
stripeRoutes.get(
  '/stripe/session/:sessionId',
  ensureAuthenticated,
  userInBlacklist,
  verifyCheckoutSessionExistsController.handle,
)

export { stripeRoutes }
