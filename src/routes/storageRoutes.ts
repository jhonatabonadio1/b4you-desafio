import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { FetchUserStorageController } from '../controllers/common/storage/FetchUserStorageController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const storageRoutes = Router()

const fetchUserStorageController = new FetchUserStorageController()

storageRoutes.get(
  '/storage',
  ensureAuthenticated,
  userInBlacklist,
  fetchUserStorageController.handle,
)

export { storageRoutes }
