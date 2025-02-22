import { Router } from 'express'

import { CreatePageViewController } from '../controllers/common/tracking/CreatePageViewController'
import { FetchDocumentTrackingController } from '../controllers/common/tracking/FetchDocumentTrackingController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { FetchPageAnalyticsController } from '../controllers/common/tracking/FetchPagesAnalyticsController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const trackingRoutes = Router()

const createPageViewController = new CreatePageViewController()
const fetchDocumentTrackingController = new FetchDocumentTrackingController()
const fetchPageAnalyticsController = new FetchPageAnalyticsController()

trackingRoutes.post(
  '/tracking/:sessionId/pageview',
  userInBlacklist,
  createPageViewController.handle,
)

trackingRoutes.get(
  '/tracking/:docId',
  ensureAuthenticated,
  userInBlacklist,
  fetchDocumentTrackingController.handle,
)

trackingRoutes.get(
  '/tracking/:docId/pages',
  ensureAuthenticated,
  userInBlacklist,
  fetchPageAnalyticsController.handle,
)

export { trackingRoutes }
