import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'
import { SendRecoveryLinkController } from '../controllers/common/auth/SendRecoveryLinkController'
import { userInBlacklist } from '../middlewares/userInBlacklist'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()
const sendRecoveryLinkController = new SendRecoveryLinkController()

authRoutes.post('/auth/login', userInBlacklist, signInController.handle)
authRoutes.post('/auth/register', userInBlacklist, createUserController.handle)
authRoutes.post(
  '/auth/recovery',
  userInBlacklist,
  sendRecoveryLinkController.handle,
)

export { authRoutes }
