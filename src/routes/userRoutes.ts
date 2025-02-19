import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'
import { UpdateUserController } from '../controllers/common/users/UpdateUserController'

const userRoutes = Router()

const fetchUserDataController = new FetchUserDataController()
const updateUserController = new UpdateUserController()

userRoutes.get('/me', ensureAuthenticated, fetchUserDataController.handle)
userRoutes.put('/users', ensureAuthenticated, updateUserController.handle)

export { userRoutes }
