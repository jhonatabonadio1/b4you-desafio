import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'
import { UpdateUserController } from '../controllers/common/users/UpdateUserController'
import { UpdateUserPasswordController } from '../controllers/common/users/UpdateUserPasswordController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const userRoutes = Router()

const fetchUserDataController = new FetchUserDataController()
const updateUserController = new UpdateUserController()
const updateUserPasswordController = new UpdateUserPasswordController()

userRoutes.get('/me', ensureAuthenticated, fetchUserDataController.handle)
userRoutes.put(
  '/users',
  ensureAuthenticated,
  userInBlacklist,
  updateUserController.handle,
)
userRoutes.put(
  '/users/update-password',
  userInBlacklist,
  updateUserPasswordController.handle,
)

export { userRoutes }
