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
import { FetchConveniosController } from '../controllers/FetchConveniosController'
import { FetchConvenioController } from '../controllers/FetchConvenioController'
import { UpdateConvenioController } from '../controllers/UpdateConveniosController'
import { DeleteConvenioController } from '../controllers/DeleteConvenioController'
import { CreateConvenioController } from '../controllers/CreateConvenioController'
import { FetchUsuarioInformativosController } from '../controllers/FetchUsuarioInformativos'
import { FetchUsuarioConveniosController } from '../controllers/FetchUsuarioConvenios'

import { CreateVehicleController } from '../controllers/CreateVehicleController'
import { UpdateUserVehicleController } from '../controllers/UpdateUserVehicleController'
import { FetchUserVehicleController } from '../controllers/FetchUserVehicleController'
import { FetchUserVehiclesController } from '../controllers/FetchUserVehiclesController'
import { DeleteUserVehicleController } from '../controllers/DeleteUserVehicleController'

import { UpdateVehicleController } from '../controllers/UpdateVehicleController'
import { FetchVehicleController } from '../controllers/FetchVehicleController'
import { FetchVehiclesController } from '../controllers/FetchVehiclesController'
import { DeleteVehicleController } from '../controllers/DeleteVehicleController'

import { CreateProductController } from '../controllers/CreateProductController'
import { FetchProductsController } from '../controllers/FetchProductsController'
import { DeleteProductController } from '../controllers/DeleteProductController'

import { FetchUserProductsController } from '../controllers/FetchUserProductsController'
import { FetchProductPrestadoresController } from '../controllers/FetchProductPrestadoresController'

import { CreateAgendamentoController } from '../controllers/CreateAgendamentoController'
import { FetchUserAgendamentosController } from '../controllers/FetchUserAgendamentosController'

import { FetchAgendamentosController } from '../controllers/FetchAgendamentosController'
import { DeleteAgendamentoController } from '../controllers/DeleteAgendamentoController'
import { DeleteAgendamentoUserController } from '../controllers/DeleteAgendamentoUserController'

import { FetchStoreAgendamentosController } from '../controllers/FetchStoreAgendamentosController'
import { DeleteAgendamentoStoreController } from '../controllers/DeleteAgendamentoStoreController'
import { ReadQrCodeController } from '../controllers/ReadQrCodeController'
import { ValidaQrCodeController } from '../controllers/ValidaQrCodeController'

import { FetchStoreValidationsController } from '../controllers/FetchStoreValidationsController'
import { FetchAvaliacoesPendentesController } from '../controllers/FetchAvaliacoesPendentesController'

import { AvaliaAtendimentoController } from '../controllers/AvaliaAtendimentoController'

import { FetchStoreAvaliacoesController } from '../controllers/FetchStoreAvaliacoesController'
import { FetchAdminAvaliacoesController } from '../controllers/FetchAdminAvaliacoesController'
import { UploadUserAvatarController } from '../controllers/UploadUserAvatarController'

import { FetchAdminValidacoesBrindesController } from '../controllers/FetchAdminValidacoesBrindeController'
import { FetchAdminValidacoesController } from '../controllers/FetchAdminValidacoesController'

import { GetServiceInfoController } from '../controllers/GetServiceInfoController'
import { CreateAdminAgendamentoController } from '../controllers/CreateAdminAgendamentoController'
import { FetchAdminUserVehiclesController } from '../controllers/FetchAdminUserVehiclesController'

import { UploadCargaController } from '../controllers/UploadCargaController'
import { FetchCargaController } from '../controllers/FetchCargaController'
import { upload } from '../middlewares/upload'
import { FetchMemberExistsController } from '../controllers/FetchMemberExistsController'
import { DeleteCargaController } from '../controllers/DeleteCargaController'
import { CreateUserCargaController } from '../controllers/CreateUserCargaController'
import { UpdateProductController } from '../controllers/UpdateProductController'
import { FetchPrestadorHorariosController } from '../controllers/FetchPrestadorHorariosController'
import { CreatePrestadorHorariosController } from '../controllers/CreatePrestadorHorariosController'
import { DeletePrestadorHorariosController } from '../controllers/DeletePrestadorHorariosController'
import { DownloadValidacoesCSVController } from '../controllers/DownloadValidacoesCSVController'
import { DeleteAvaliacaoAdminController } from '../controllers/DeleteAvaliacaoAdminController'
import { DownloadBrindesCSVController } from '../controllers/DownloadBrindesCSVController'
import { DownloadUsuariosCSVController } from '../controllers/DownloadUsuariosCSVController'

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
const fetchUsuarioConveniosController = new FetchUsuarioConveniosController()
const fetchUsuarioInformativosController =
  new FetchUsuarioInformativosController()

const createConvenioController = new CreateConvenioController()
const updateConvenioController = new UpdateConvenioController()
const deleteConvenioController = new DeleteConvenioController()
const fetchConvenioController = new FetchConvenioController()
const fetchConveniosController = new FetchConveniosController()

const createVehicleController = new CreateVehicleController()
const updateUserVehicleController = new UpdateUserVehicleController()
const fetchUserVehicleController = new FetchUserVehicleController()
const fetchUserVehiclesController = new FetchUserVehiclesController()
const deleteUserVehicleController = new DeleteUserVehicleController()

const updateVehicleController = new UpdateVehicleController()
const fetchVehicleController = new FetchVehicleController()
const fetchVehiclesController = new FetchVehiclesController()
const deleteVehicleController = new DeleteVehicleController()

const createProductController = new CreateProductController()
const updateProductController = new UpdateProductController()
const fetchProductsController = new FetchProductsController()
const deleteProductController = new DeleteProductController()

const fetchUserProductsController = new FetchUserProductsController()
const fetchProductPrestadoresController =
  new FetchProductPrestadoresController()

const createAgendamentoController = new CreateAgendamentoController()
const fetchUserAgendamentosController = new FetchUserAgendamentosController()

const fetchStoreAgendamentosController = new FetchStoreAgendamentosController()

const fetchAgendamentosController = new FetchAgendamentosController()
const deleteAgendamentoController = new DeleteAgendamentoController()

const deleteAgendamentoUserController = new DeleteAgendamentoUserController()
const deleteAgendamentoStoreController = new DeleteAgendamentoStoreController()

const readQrCodeController = new ReadQrCodeController()

const validaQrCodeController = new ValidaQrCodeController()

const fetchStoreValidationsController = new FetchStoreValidationsController()

const fetchAvaliacoesPendentesController =
  new FetchAvaliacoesPendentesController()

const avaliaAtendimentoController = new AvaliaAtendimentoController()

const fetchStoreAvaliacoesController = new FetchStoreAvaliacoesController()
const fetchAdminAvaliacoesController = new FetchAdminAvaliacoesController()

const uploadUserAvatarController = new UploadUserAvatarController()

const fetchAdminValidacoesBrindesController =
  new FetchAdminValidacoesBrindesController()
const fetchAdminValidacoesController = new FetchAdminValidacoesController()

const getServiceInfoController = new GetServiceInfoController()

const createAdminAgendamentoController = new CreateAdminAgendamentoController()
const fetchAdminUserVehiclesController = new FetchAdminUserVehiclesController()

const uploadCargaController = new UploadCargaController()
const fetchCargaController = new FetchCargaController()

const fetchMemberExistsController = new FetchMemberExistsController()
const deleteCargaController = new DeleteCargaController()
const createUserCargaController = new CreateUserCargaController()

const fetchPrestadorHorariosController = new FetchPrestadorHorariosController()
const createPrestadorHorariosController =
  new CreatePrestadorHorariosController()

const deletePrestadorHorariosController =
  new DeletePrestadorHorariosController()

const downloadValidacoesCSVController = new DownloadValidacoesCSVController()
const downloadBrindesCSVController = new DownloadBrindesCSVController()
const downloadUsuariosCSVController = new DownloadUsuariosCSVController()

const deleteAvaliacaoAdminController = new DeleteAvaliacaoAdminController()

authRoutes.post('/admin/users', ensureIsAdmin, createUserController.handle)
authRoutes.post('/users', createUserCargaController.handle)
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
  upload.single('file'),
  (req, res) => {
    createInformativoController.handle(req, res)
  },
)
authRoutes.delete(
  '/admin/informativos/:id',
  ensureIsAdmin,
  deleteInformativoController.handle,
)
authRoutes.put(
  '/admin/informativos/:id',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    updateInformativoController.handle(req, res)
  },
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
authRoutes.get(
  '/convenios',
  ensureAuthenticated,
  fetchUsuarioConveniosController.handle,
)
authRoutes.get(
  '/informativos',
  ensureAuthenticated,
  fetchUsuarioInformativosController.handle,
)

authRoutes.post(
  '/admin/convenios',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    createConvenioController.handle(req, res)
  },
)
authRoutes.delete(
  '/admin/convenios/:id',
  ensureIsAdmin,
  deleteConvenioController.handle,
)
authRoutes.put(
  '/admin/convenios/:id',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    updateConvenioController.handle(req, res)
  },
)
authRoutes.get(
  '/admin/convenios',
  ensureIsAdmin,
  fetchConveniosController.handle,
)
authRoutes.get(
  '/admin/convenios/:id',
  ensureIsAdmin,
  fetchConvenioController.handle,
)

authRoutes.post(
  '/veiculos',
  ensureAuthenticated,
  createVehicleController.handle,
)
authRoutes.put(
  '/veiculos/:vehicleId',
  ensureAuthenticated,
  updateUserVehicleController.handle,
)
authRoutes.delete(
  '/veiculos/:vehicleId',
  ensureAuthenticated,
  deleteUserVehicleController.handle,
)
authRoutes.get(
  '/veiculos/:vehicleId',
  ensureAuthenticated,
  fetchUserVehicleController.handle,
)
authRoutes.get(
  '/veiculos',
  ensureAuthenticated,
  fetchUserVehiclesController.handle,
)

authRoutes.put(
  '/admin/veiculos/:vehicleId',
  ensureIsAdmin,
  updateVehicleController.handle,
)
authRoutes.delete(
  '/admin/veiculos/:vehicleId',
  ensureIsAdmin,
  deleteVehicleController.handle,
)
authRoutes.get(
  '/admin/veiculos/:vehicleId',
  ensureIsAdmin,
  fetchVehicleController.handle,
)
authRoutes.get('/admin/veiculos', ensureIsAdmin, fetchVehiclesController.handle)

authRoutes.post(
  '/admin/servicos',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    createProductController.handle(req, res)
  },
)
authRoutes.put(
  '/admin/servicos/:id',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    updateProductController.handle(req, res)
  },
)
authRoutes.get('/admin/servicos', ensureIsAdmin, fetchProductsController.handle)
authRoutes.delete(
  '/admin/servicos/:produtoId',
  ensureIsAdmin,
  deleteProductController.handle,
)

authRoutes.get(
  '/servicos',
  ensureAuthenticated,
  fetchUserProductsController.handle,
)
authRoutes.get(
  '/servicos/:produtoId/prestadores',
  ensureAuthenticated,
  fetchProductPrestadoresController.handle,
)

authRoutes.post(
  '/agendamento',
  ensureAuthenticated,
  createAgendamentoController.handle,
)
authRoutes.get(
  '/agendamentos',
  ensureAuthenticated,
  fetchUserAgendamentosController.handle,
)
authRoutes.delete(
  '/agendamentos/:id',
  ensureAuthenticated,
  deleteAgendamentoUserController.handle,
)
authRoutes.get(
  '/store/agendamentos',
  ensureAuthenticated,
  fetchStoreAgendamentosController.handle,
)
authRoutes.delete(
  '/store/agendamentos/:id',
  ensureAuthenticated,
  deleteAgendamentoStoreController.handle,
)

authRoutes.get(
  '/admin/agendamentos',
  ensureIsAdmin,
  fetchAgendamentosController.handle,
)
authRoutes.delete(
  '/admin/agendamentos/:id',
  ensureIsAdmin,
  deleteAgendamentoController.handle,
)

authRoutes.get(
  '/dadosAgendamento',
  ensureAuthenticated,
  readQrCodeController.handle,
)

authRoutes.post(
  '/validaQrCode',
  ensureAuthenticated,
  validaQrCodeController.handle,
)

authRoutes.get(
  '/validacoes',
  ensureAuthenticated,
  fetchStoreValidationsController.handle,
)

authRoutes.get(
  '/avaliacoes',
  ensureAuthenticated,
  fetchAvaliacoesPendentesController.handle,
)

authRoutes.post(
  '/avaliaLoja/:id',
  ensureAuthenticated,
  avaliaAtendimentoController.handle,
)

authRoutes.get(
  '/store/avaliacoes',
  ensureAuthenticated,
  fetchStoreAvaliacoesController.handle,
)

authRoutes.get(
  '/admin/avaliacoes',
  ensureIsAdmin,
  fetchAdminAvaliacoesController.handle,
)

authRoutes.delete(
  '/admin/avaliacoes/:id',
  ensureIsAdmin,
  deleteAvaliacaoAdminController.handle,
)

authRoutes.get(
  '/admin/validacoes',
  ensureIsAdmin,
  fetchAdminValidacoesController.handle,
)

authRoutes.get(
  '/admin/validacoesBrindes',
  ensureIsAdmin,
  fetchAdminValidacoesBrindesController.handle,
)

authRoutes.post(
  '/trocaAvatar',
  ensureAuthenticated,
  upload.single('file'),
  (req, res) => {
    uploadUserAvatarController.handle(req, res)
  },
)

authRoutes.get(
  '/admin/servico/:id',
  ensureIsAdmin,
  getServiceInfoController.handle,
)

authRoutes.get(
  '/admin/servicos/:produtoId/prestadores',
  ensureIsAdmin,
  fetchProductPrestadoresController.handle,
)

authRoutes.post(
  '/admin/agendamentos',
  ensureIsAdmin,
  createAdminAgendamentoController.handle,
)

authRoutes.get(
  '/admin/usuarios/:userId/veiculos',
  ensureIsAdmin,
  fetchAdminUserVehiclesController.handle,
)

authRoutes.post(
  '/admin/cargas',
  ensureIsAdmin,
  upload.single('file'),
  (req, res) => {
    uploadCargaController.handle(req, res)
  },
)
authRoutes.get('/admin/cargas', ensureIsAdmin, fetchCargaController.handle)
authRoutes.get('/membro', fetchMemberExistsController.handle)
authRoutes.delete(
  '/admin/cargas/:id',
  ensureIsAdmin,
  deleteCargaController.handle,
)

authRoutes.get(
  '/store/horarios',
  ensureAuthenticated,
  fetchPrestadorHorariosController.handle,
)

authRoutes.post(
  '/store/horarios',
  ensureAuthenticated,
  createPrestadorHorariosController.handle,
)

authRoutes.delete(
  '/store/horarios',
  ensureAuthenticated,
  deletePrestadorHorariosController.handle,
)

authRoutes.get(
  '/admin/download-validacoes-csv',
  ensureIsAdmin,
  downloadValidacoesCSVController.handle,
)

authRoutes.get(
  '/admin/download-brindes-csv',
  ensureIsAdmin,
  downloadBrindesCSVController.handle,
)

authRoutes.get(
  '/admin/download-usuarios-csv',
  ensureIsAdmin,
  downloadUsuariosCSVController.handle,
)

export { authRoutes }
