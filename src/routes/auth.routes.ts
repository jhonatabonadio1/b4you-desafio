import { Router } from 'express'

import { AuthUserController } from '../controllers/AuthUserController'
import { CreateUserController } from '../controllers/CreateUserController'
import { VerifyAuthMatriculaController } from '../controllers/VerifyAuthMatriculaController'

import { CreatePrestadorController } from '../controllers/CreatePrestadorController'

const authRoutes = Router()

const verifyAuthMatriculaController = new VerifyAuthMatriculaController()
const authUserController = new AuthUserController()
const createUserController = new CreateUserController()

const createPrestadorController = new CreatePrestadorController()

authRoutes.post('/users', createUserController.handle)
authRoutes.post('/sessions', authUserController.handle)
authRoutes.post('/verificaLogin', verifyAuthMatriculaController.handle)

authRoutes.post('/prestadores', createPrestadorController.handle)

export { authRoutes }
