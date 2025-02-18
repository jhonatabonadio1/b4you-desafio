import { Router } from 'express'

import { CreatePageViewController } from '../controllers/common/tracking/CreatePageViewController'

const trackingRoutes = Router()

const createPageViewController = new CreatePageViewController()

trackingRoutes.post(
  '/tracking/:sessionId/pageview',
  createPageViewController.handle,
)

export { trackingRoutes }
