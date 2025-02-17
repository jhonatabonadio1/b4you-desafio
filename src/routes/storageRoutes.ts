import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { FetchUserStorageController } from '../controllers/common/storage/FetchUserStorageController'

const storageRoutes = Router()

const fetchUserStorageController = new FetchUserStorageController()

storageRoutes.get(
  '/storage',
  ensureAuthenticated,
  fetchUserStorageController.handle,
)

export { storageRoutes }
