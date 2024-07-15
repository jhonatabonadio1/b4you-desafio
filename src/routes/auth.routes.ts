import { Router } from 'express'

import { AuthUserController } from '../controllers/AuthUserController'

import { CreateUserController } from '../controllers/CreateUserController'
import { UpdateUserController } from '../controllers/UpdateUserController'
import { FetchUserController } from '../controllers/FetchUserController'
import { DeleteUserController } from '../controllers/DeleteUserController'
import { FetchUsersController } from '../controllers/FetchUsersController'

import { VerifyAuthMatriculaController } from '../controllers/VerifyAuthMatriculaController'

import { CreatePrestadorController } from '../controllers/CreatePrestadorController'
import { ensureIsAdmin } from '../middlewares/ensureIsAdmin'

import { UpdatePrestadorController } from '../controllers/UpdatePrestadorController'
import { FetchPrestadorController } from '../controllers/FetchPrestadorController'
import { DeletePrestadorController } from '../controllers/DeletePrestadorController'
import { FetchPrestadoresController } from '../controllers/FetchPrestadoresController'

import { AuthAdminController } from '../controllers/AuthAdminController'
import { FetchAdminController } from '../controllers/FetchAdminController'

import { CreateInformativoController } from '../controllers/CreateInformativoController'
import { UpdateInformativoController } from '../controllers/UpdateInformativoController'
import { DeleteInformativoController } from '../controllers/DeleteInformativoController'
import { FetchInformativoController } from '../controllers/FetchInformativoController'
import { FetchInformativosController } from '../controllers/FetchInformativosController'

import { CreateBrindeController } from '../controllers/CreateBrindeController'
import { UpdateBrindeController } from '../controllers/UpdateBrindeController'
import { DeleteBrindeController } from '../controllers/DeleteBrindeController'
import { FetchBrindeController } from '../controllers/FetchBrindeController'
import { FetchBrindesController } from '../controllers/FetchBrindesController'

import { FetchUsuarioBrindesController } from '../controllers/FetchUsuarioBrindesController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

const authRoutes = Router()

const verifyAuthMatriculaController = new VerifyAuthMatriculaController()
const authUserController = new AuthUserController()

const createUserController = new CreateUserController()
const updateUserController = new UpdateUserController()
const fetchUserController = new FetchUserController()
const deleteUserController = new DeleteUserController()
const fetchUsersController = new FetchUsersController()

const createPrestadorController = new CreatePrestadorController()
const updatePrestadorController = new UpdatePrestadorController()
const fetchPrestadorController = new FetchPrestadorController()
const deletePrestadorController = new DeletePrestadorController()
const fetchPrestadoresController = new FetchPrestadoresController()

const authAdminController = new AuthAdminController()
const fetchAdminController = new FetchAdminController()

const createInformativoController = new CreateInformativoController()
const updateInformativoController = new UpdateInformativoController()
const deleteInformativoController = new DeleteInformativoController()
const fetchInformativoController = new FetchInformativoController()
const fetchInformativosController = new FetchInformativosController()

const createBrindeController = new CreateBrindeController()
const updateBrindeController = new UpdateBrindeController()
const deleteBrindeController = new DeleteBrindeController()
const fetchBrindeController = new FetchBrindeController()
const fetchBrindesController = new FetchBrindesController()

const fetchUsuarioBrindesController = new FetchUsuarioBrindesController()

authRoutes.post('/admin/users', ensureIsAdmin, createUserController.handle)
authRoutes.put(
  '/admin/users/:usuarioId',
  ensureIsAdmin,
  updateUserController.handle,
)
authRoutes.get(
  '/admin/users/:usuarioId',
  ensureIsAdmin,
  fetchUserController.handle,
)
authRoutes.delete(
  '/admin/users/:usuarioId',
  ensureIsAdmin,
  deleteUserController.handle,
)
authRoutes.get('/admin/users', ensureIsAdmin, fetchUsersController.handle)
authRoutes.post(
  '/admin/prestadores',
  ensureIsAdmin,
  createPrestadorController.handle,
)
authRoutes.put(
  '/admin/prestadores/:prestadorId',
  ensureIsAdmin,
  updatePrestadorController.handle,
)
authRoutes.delete(
  '/admin/prestadores/:prestadorId',
  ensureIsAdmin,
  deletePrestadorController.handle,
)
authRoutes.get(
  '/admin/prestadores',
  ensureIsAdmin,
  fetchPrestadoresController.handle,
)

authRoutes.post('/sessions', authUserController.handle)
authRoutes.post('/verificaLogin', verifyAuthMatriculaController.handle)

authRoutes.get(
  '/admin/prestadores/:prestadorId',
  ensureIsAdmin,
  fetchPrestadorController.handle,
)
authRoutes.post('/admin/sessions', authAdminController.handle)
authRoutes.get('/admin/me', ensureIsAdmin, fetchAdminController.handle)

authRoutes.post(
  '/admin/informativos',
  ensureIsAdmin,
  createInformativoController.handle,
)
authRoutes.delete(
  '/admin/informativos/:id',
  ensureIsAdmin,
  deleteInformativoController.handle,
)
authRoutes.put(
  '/admin/informativos/:id',
  ensureIsAdmin,
  updateInformativoController.handle,
)
authRoutes.get(
  '/admin/informativos',
  ensureIsAdmin,
  fetchInformativosController.handle,
)
authRoutes.get(
  '/admin/informativos/:id',
  ensureIsAdmin,
  fetchInformativoController.handle,
)

authRoutes.post('/admin/brindes', ensureIsAdmin, createBrindeController.handle)

authRoutes.delete(
  '/admin/brindes/:id',
  ensureIsAdmin,
  deleteBrindeController.handle,
)
authRoutes.put(
  '/admin/brindes/:id',
  ensureIsAdmin,
  updateBrindeController.handle,
)
authRoutes.get('/admin/brindes', ensureIsAdmin, fetchBrindesController.handle)
authRoutes.get(
  '/admin/brindes/:id',
  ensureIsAdmin,
  fetchBrindeController.handle,
)

authRoutes.get(
  '/brindes',
  ensureAuthenticated,
  fetchUsuarioBrindesController.handle,
)

export { authRoutes }
