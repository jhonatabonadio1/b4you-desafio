import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'
import { RefreshTokenController } from '../controllers/common/auth/RefreshTokenController'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()
const refreshTokenController = new RefreshTokenController()

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', createUserController.handle)
authRoutes.post('/auth/token/refresh', refreshTokenController.handle)

export { authRoutes }
