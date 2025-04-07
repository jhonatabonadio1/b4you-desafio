import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'
import { RefreshTokenController } from '../controllers/common/auth/RefreshTokenController'
import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()
const refreshTokenController = new RefreshTokenController()
const fetchUserDataController = new FetchUserDataController()

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', createUserController.handle)
authRoutes.get('/auth/me', ensureAuthenticated, fetchUserDataController.handle)
authRoutes.post('/auth/token/refresh', refreshTokenController.handle)

export { authRoutes }
