import { Router } from 'express'

import { AuthUserController } from '../controllers/AuthUserController'
import { CreateUserController } from '../controllers/CreateUserController'
import { VerifyAuthMatriculaController } from '../controllers/VerifyAuthMatriculaController'

import { CreatePrestadorController } from '../controllers/CreatePrestadorController'
import { ensureIsAdmin } from '../middlewares/ensureIsAdmin'
import { UpdatePrestadorController } from '../controllers/UpdatePrestadorController'
import { ReadPrestadorController } from '../controllers/ReadPrestadorController'
import { DeletePrestadorController } from '../controllers/DeletePrestadorController'
import { FetchPrestadoresController } from '../controllers/FetchPrestadoresController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { AuthAdminController } from '../controllers/AuthAdminController'
import { FetchAdminController } from '../controllers/FetchAdminController'

const authRoutes = Router()

const verifyAuthMatriculaController = new VerifyAuthMatriculaController()
const authUserController = new AuthUserController()
const createUserController = new CreateUserController()

const createPrestadorController = new CreatePrestadorController()
const updatePrestadorController = new UpdatePrestadorController()
const readPrestadorController = new ReadPrestadorController()
const deletePrestadorController = new DeletePrestadorController()
const fetchPrestadoresController = new FetchPrestadoresController()

const authAdminController = new AuthAdminController()
const fetchAdminController = new FetchAdminController()

authRoutes.post('/users', ensureIsAdmin, createUserController.handle)
authRoutes.post('/sessions', authUserController.handle)
authRoutes.post('/verificaLogin', verifyAuthMatriculaController.handle)

authRoutes.post('/prestadores', ensureIsAdmin, createPrestadorController.handle)
authRoutes.put(
  '/prestadores/:prestadorId',
  ensureIsAdmin,
  updatePrestadorController.handle,
)
authRoutes.get(
  '/prestadores/:prestadorId',
  ensureAuthenticated,
  readPrestadorController.handle,
)
authRoutes.delete(
  '/prestadores/:prestadorId',
  ensureIsAdmin,
  deletePrestadorController.handle,
)
authRoutes.get(
  '/prestadores',
  ensureAuthenticated,
  fetchPrestadoresController.handle,
)

authRoutes.post('/admin/sessions', authAdminController.handle)
authRoutes.get('/admin/me', ensureIsAdmin, fetchAdminController.handle)

export { authRoutes }
