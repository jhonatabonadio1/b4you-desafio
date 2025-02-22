import { Router } from 'express'

import { CaptureHeatmapsController } from '../controllers/common/heatmaps/CaptureHeatmapsController'
import { FetchHeatmapsController } from '../controllers/common/heatmaps/FetchHeatmapsController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const heatmapRoutes = Router()

const captureHeatmapsController = new CaptureHeatmapsController()
const fetchHeatmapsController = new FetchHeatmapsController()

heatmapRoutes.post(
  '/heatmaps/lote',
  userInBlacklist,
  captureHeatmapsController.handle,
)
heatmapRoutes.get(
  '/heatmaps/:docId/:page',
  ensureAuthenticated,
  userInBlacklist,
  fetchHeatmapsController.handle,
)

export { heatmapRoutes }
