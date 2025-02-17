import { Router } from 'express'

import { CaptureHeatmapsController } from '../controllers/common/heatmaps/CaptureHeatmapsController'
import { FetchHeatmapsController } from '../controllers/common/heatmaps/FetchHeatmapsController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

const heatmapRoutes = Router()

const captureHeatmapsController = new CaptureHeatmapsController()
const fetchHeatmapsController = new FetchHeatmapsController()

heatmapRoutes.post('/heatmaps/lote', captureHeatmapsController.handle)
heatmapRoutes.get(
  '/heatmaps/:docId/:page',
  ensureAuthenticated,
  fetchHeatmapsController.handle,
)

export { heatmapRoutes }
