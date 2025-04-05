import { Router } from 'express'

import { CreateCampaingController } from '../controllers/common/campaing/CreateCampaingController'
import { ReadCampaingController } from '../controllers/common/campaing/ReadCampaingController'
import { UpdateCampaingController } from '../controllers/common/campaing/UpdateCampaingController'
import { DeleteCampaingController } from '../controllers/common/campaing/DeleteCampaingController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

const campaingRoutes = Router()

const createCampaingController = new CreateCampaingController()
const readCampaingController = new ReadCampaingController()
const updateCampaingController = new UpdateCampaingController()
const deleteCampaingController = new DeleteCampaingController()

campaingRoutes.post(
  '/campaing',
  ensureAuthenticated,
  createCampaingController.handle,
)

campaingRoutes.get(
  '/campaing',
  ensureAuthenticated,
  readCampaingController.handle,
)

campaingRoutes.put(
  '/campaing/:id',
  ensureAuthenticated,
  updateCampaingController.handle,
)

campaingRoutes.delete(
  '/campaing/:id',
  ensureAuthenticated,
  deleteCampaingController.handle,
)

export { campaingRoutes }
