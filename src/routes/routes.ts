import { Router } from 'express'
import multer from 'multer'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/common/users/CreateUserController'
import { CreateOptionController } from '../controllers/common/options/CreateOptionController'
import { ListAllImoveisController } from '../controllers/common/imoveis/ListAllImoveisController'
import { ListAllPropertiesController } from '../controllers/common/properties/ListAllPropertiesController'
import { ListAllUsersController } from '../controllers/common/users/ListAllUsersController'

import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { SearchPropertyController } from '../controllers/common/properties/SearchPropertyController'
import { SearchImovelController } from '../controllers/common/imoveis/SearchImovelController'
import { ToggleClienteFuturoController } from '../controllers/common/properties/ToggleClienteFuturoController'

import { DeleteImovelController } from '../controllers/common/imoveis/DeleteImovelController'
import { DeletePropertyController } from '../controllers/common/properties/DeletePropertyController'

import { EditOptionController } from '../controllers/common/options/EditOptionController'
import { FetchUserImoveisController } from '../controllers/common/imoveis/FetchUserImoveisController'
import { FetchUserImovelController } from '../controllers/common/imoveis/FetchUserImovelController'
import { FetchUserPropertiesController } from '../controllers/common/properties/FetchUserPropertiesController'
import { FetchUserPropertyController } from '../controllers/common/properties/FetchUserPropertyController'

import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'

import { SaveImovelController } from '../controllers/common/imoveis/SaveImovelController'
import { SavePropertyController } from '../controllers/common/properties/SavePropertyController'

import { UpdateImovelController } from '../controllers/common/imoveis/UpdateImovelController'
import { UpdatePropertyController } from '../controllers/common/properties/UpdatePropertyController'
import { UploadFileController } from '../controllers/common/files/UploadFileController'
import { FetchFilesController } from '../controllers/common/files/FetchFilesController'
import { DeleteFileController } from '../controllers/common/files/DeleteFileController'
import { FetchUserStorageController } from '../controllers/common/storage/FetchUserStorageController'
import { GetFileController } from '../controllers/common/files/GetFileController'
import { CreateHeatmapController } from '../controllers/common/heatmaps/CreateHeatMapController'
import { FetchHeatmapController } from '../controllers/common/heatmaps/FetchHeatMapController'

const authRoutes = Router()

const signInController = new SignInController()
const createUserController = new CreateUserController()
const createOptionController = new CreateOptionController()
const listAllImoveisController = new ListAllImoveisController()
const listAllPropertiesController = new ListAllPropertiesController()
const listAllUsersController = new ListAllUsersController()
const searchPropertyController = new SearchPropertyController()
const searchImovelController = new SearchImovelController()
const toggleClienteFuturoController = new ToggleClienteFuturoController()

const deleteImovelController = new DeleteImovelController()
const deletePropertyController = new DeletePropertyController()
const editOptionController = new EditOptionController()
const fetchUserImoveisController = new FetchUserImoveisController()
const fetchUserImovelController = new FetchUserImovelController()
const fetchUserPropertiesController = new FetchUserPropertiesController()
const fetchUserPropertyController = new FetchUserPropertyController()

const fetchUserDataController = new FetchUserDataController()

const saveImovelController = new SaveImovelController()
const savePropertyController = new SavePropertyController()

const updateImovelController = new UpdateImovelController()
const updatePropertyController = new UpdatePropertyController()

const uploadFileController = new UploadFileController()
const fetchFilesController = new FetchFilesController()
const deleteFileController = new DeleteFileController()

const fetchUserStorageController = new FetchUserStorageController()
const getFileController = new GetFileController()

const createHeatmapController = new CreateHeatmapController()
const fetchHeatmapController = new FetchHeatmapController()

const upload = multer({ dest: 'uploads/' }) // Ajuste conforme necessário

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', createUserController.handle)
authRoutes.put(
  '/add-option/:id',
  ensureAuthenticated,
  createOptionController.handle,
)
authRoutes.get(
  '/all-imoveis',
  ensureAuthenticated,
  listAllImoveisController.handle,
)
authRoutes.post(
  '/all-properties',
  ensureAuthenticated,
  listAllPropertiesController.handle,
)
authRoutes.get('/all-users', ensureAuthenticated, listAllUsersController.handle)
authRoutes.get(
  '/buscaCliente',
  ensureAuthenticated,
  searchPropertyController.handle,
)
authRoutes.get(
  '/buscaImovel',
  ensureAuthenticated,
  searchImovelController.handle,
)
authRoutes.post(
  '/cliente-futuro',
  ensureAuthenticated,
  toggleClienteFuturoController.handle,
)

authRoutes.delete(
  '/delete-imovel/:id',
  ensureAuthenticated,
  deleteImovelController.handle,
)
authRoutes.delete(
  '/delete-property/:id',
  ensureAuthenticated,
  deletePropertyController.handle,
)
authRoutes.put(
  '/edit-option/:id',
  ensureAuthenticated,
  editOptionController.handle,
)
authRoutes.get(
  '/fetch-imoveis',
  ensureAuthenticated,
  fetchUserImoveisController.handle,
)
authRoutes.get(
  '/fetch-imovel',
  ensureAuthenticated,
  fetchUserImovelController.handle,
)
authRoutes.get(
  '/fetch-properties',
  ensureAuthenticated,
  fetchUserPropertiesController.handle,
)
authRoutes.get(
  '/fetch-property',
  ensureAuthenticated,
  fetchUserPropertyController.handle,
)

authRoutes.get('/me', ensureAuthenticated, fetchUserDataController.handle)

authRoutes.post(
  '/save-imovel',
  ensureAuthenticated,
  saveImovelController.handle,
)
authRoutes.post(
  '/save-property',
  ensureAuthenticated,
  savePropertyController.handle,
)

authRoutes.put(
  '/update-imovel',
  ensureAuthenticated,
  updateImovelController.handle,
)
authRoutes.put(
  '/update-property',
  ensureAuthenticated,
  updatePropertyController.handle,
)

authRoutes.get('/file/:docId', getFileController.handle)

authRoutes.post(
  '/file',
  ensureAuthenticated,
  upload.single('file'),
  uploadFileController.handle,
)
authRoutes.get('/files', ensureAuthenticated, fetchFilesController.handle)
authRoutes.delete(
  '/files/:docId',
  ensureAuthenticated,
  deleteFileController.handle,
)

authRoutes.get(
  '/storage',
  ensureAuthenticated,
  fetchUserStorageController.handle,
)

authRoutes.get(
  '/storage',
  ensureAuthenticated,
  fetchUserStorageController.handle,
)

authRoutes.post(
  '/heatmap',
  upload.array('heatmaps'),
  createHeatmapController.handle,
)

authRoutes.get('/heatmap/:docId', fetchHeatmapController.handle)

export { authRoutes }
