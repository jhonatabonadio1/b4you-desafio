import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'

const userRoutes = Router()

const fetchUserDataController = new FetchUserDataController()

userRoutes.get('/me', ensureAuthenticated, fetchUserDataController.handle)

export { userRoutes }
