import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', createUserController.handle)

export { authRoutes }
