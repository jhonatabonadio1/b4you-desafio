import { Router } from 'express'

import { AuthUserController } from '../controllers/AuthUserController'
import { CreateUserController } from '../controllers/CreateUserController'
const authRoutes = Router()

const authUserController = new AuthUserController()
const createUserController = new CreateUserController()

authRoutes.post('/users', createUserController.handle)
authRoutes.post('/sessions', authUserController.handle)

export { authRoutes }
