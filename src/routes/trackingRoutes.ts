import { Router } from 'express'

import { CreatePageViewController } from '../controllers/common/tracking/CreatePageViewController'
import { FetchDocumentTrackingController } from '../controllers/common/tracking/FetchDocumentTrackingController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { FetchPageAnalyticsController } from '../controllers/common/tracking/FetchPagesAnalyticsController'

const trackingRoutes = Router()

const createPageViewController = new CreatePageViewController()
const fetchDocumentTrackingController = new FetchDocumentTrackingController()
const fetchPageAnalyticsController = new FetchPageAnalyticsController()

trackingRoutes.post(
  '/tracking/:sessionId/pageview',
  createPageViewController.handle,
)

trackingRoutes.get(
  '/tracking/:docId',
  ensureAuthenticated,
  fetchDocumentTrackingController.handle,
)

trackingRoutes.get(
  '/tracking/:docId/pages',
  ensureAuthenticated,
  fetchPageAnalyticsController.handle,
)

export { trackingRoutes }
