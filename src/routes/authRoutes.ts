import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'
import { SendRecoveryLinkController } from '../controllers/common/auth/SendRecoveryLinkController'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()
const sendRecoveryLinkController = new SendRecoveryLinkController()

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', createUserController.handle)
authRoutes.post('/auth/recovery', sendRecoveryLinkController.handle)

export { authRoutes }
