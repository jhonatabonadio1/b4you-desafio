import { Router } from 'express'

import { SignInController } from '../controllers/common/auth/SignInController'
import { CreateUserController } from '../controllers/admin/auth/CreateUserController'
import { CreateOptionController } from '../controllers/common/options/CreateOptionController'
import { ListAllImoveisController } from '../controllers/common/imoveis/ListAllImoveisController'
import { ListAllPropertiesController } from '../controllers/common/properties/ListAllPropertiesController'
import { ListAllUsersController } from '../controllers/common/users/ListAllUsersController'

import { ensureIsAdmin } from '../middlewares/ensureIsAdmin'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { SearchPropertyController } from '../controllers/common/properties/SearchPropertyController'
import { SearchImovelController } from '../controllers/common/imoveis/SearchImovelController'
import { ToggleClienteFuturoController } from '../controllers/common/properties/ToggleClienteFuturoController'
import { DeleteImageController } from '../controllers/common/images/DeleteImageController'
import { DeleteImovelController } from '../controllers/common/imoveis/DeleteImovelController'
import { DeletePropertyController } from '../controllers/common/properties/DeletePropertyController'
import { DownloadImovelImagesController } from '../controllers/common/imoveis/DownloadImovelImagesController'
import { EditOptionController } from '../controllers/common/options/EditOptionController'
import { FetchUserImoveisController } from '../controllers/common/imoveis/FetchUserImoveisController'
import { FetchUserImovelController } from '../controllers/common/imoveis/FetchUserImovelController'
import { FetchUserPropertiesController } from '../controllers/common/properties/FetchUserPropertiesController'
import { FetchUserPropertyController } from '../controllers/common/properties/FetchUserPropertyController'
import { CreateFonteController } from '../controllers/admin/fontes/CreateFonteController'
import { FetchFontesController } from '../controllers/admin/fontes/FetchFontesController'
import { DeleteFontesController } from '../controllers/admin/fontes/DeleteFontesController'
import { FetchLocationsController } from '../controllers/admin/locations/FetchLocationsController'
import { CreateLocationController } from '../controllers/admin/locations/CreateLocationController'
import { DeleteLocationController } from '../controllers/admin/locations/DeleteLocationController'
import { FetchUserDataController } from '../controllers/common/users/FetchUserDataController'
import { SaveEnvioController } from '../controllers/common/envios/SaveEnvioController'
import { SaveImovelController } from '../controllers/common/imoveis/SaveImovelController'
import { SavePropertyController } from '../controllers/common/properties/SavePropertyController'
import { FetchTiposController } from '../controllers/admin/tipos/FetchTiposController'
import { CreateTipoController } from '../controllers/admin/tipos/CreateTipoController'
import { DeleteTipoController } from '../controllers/admin/tipos/DeleteTipoController'
import { UpdateImovelController } from '../controllers/common/imoveis/UpdateImovelController'
import { UpdatePropertyController } from '../controllers/common/properties/UpdatePropertyController'
import { UploadImageController } from '../controllers/common/images/UploadImageController'
import { FetchUsersController } from '../controllers/admin/users/FetchUsersController'
import { UpdateUserController } from '../controllers/admin/users/UpdateUserController'
import { DeleteUserController } from '../controllers/admin/users/DeleteUserController'

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
const deleteImageController = new DeleteImageController()
const deleteImovelController = new DeleteImovelController()
const deletePropertyController = new DeletePropertyController()
const downloadImovelImagesController = new DownloadImovelImagesController()
const editOptionController = new EditOptionController()
const fetchUserImoveisController = new FetchUserImoveisController()
const fetchUserImovelController = new FetchUserImovelController()
const fetchUserPropertiesController = new FetchUserPropertiesController()
const fetchUserPropertyController = new FetchUserPropertyController()

const fetchFontesController = new FetchFontesController()
const createFonteController = new CreateFonteController()
const deleteFontesController = new DeleteFontesController()

const fetchLocationsController = new FetchLocationsController()
const createLocationController = new CreateLocationController()
const deleteLocationController = new DeleteLocationController()

const fetchUserDataController = new FetchUserDataController()
const saveEnvioController = new SaveEnvioController()
const saveImovelController = new SaveImovelController()
const savePropertyController = new SavePropertyController()

const fetchTiposController = new FetchTiposController()
const createTipoController = new CreateTipoController()
const deleteTipoController = new DeleteTipoController()
const updateImovelController = new UpdateImovelController()
const updatePropertyController = new UpdatePropertyController()
const uploadImageController = new UploadImageController()

const fetchUsersController = new FetchUsersController()
const updateUserController = new UpdateUserController()
const deleteUserController = new DeleteUserController()

authRoutes.post('/auth/login', signInController.handle)
authRoutes.post('/auth/register', ensureIsAdmin, createUserController.handle)
authRoutes.post(
  '/add-option/:id',
  ensureAuthenticated,
  createOptionController.handle,
)
authRoutes.get(
  '/all-imoveis',
  ensureAuthenticated,
  listAllImoveisController.handle,
)
authRoutes.get(
  '/all-properties',
  ensureAuthenticated,
  listAllPropertiesController.handle,
)
authRoutes.get('/all-users', ensureIsAdmin, listAllUsersController.handle)
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
  '/delete-image',
  ensureAuthenticated,
  deleteImageController.handle,
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
authRoutes.get(
  '/download-images',
  ensureAuthenticated,
  downloadImovelImagesController.handle,
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
authRoutes.get('/fontes', ensureIsAdmin, fetchFontesController.handle)
authRoutes.post('/fontes', ensureIsAdmin, createFonteController.handle)
authRoutes.delete('/fontes', ensureIsAdmin, deleteFontesController.handle)
authRoutes.get('/locations', ensureIsAdmin, fetchLocationsController.handle)
authRoutes.post('/locations', ensureIsAdmin, createLocationController.handle)
authRoutes.delete('/locations', ensureIsAdmin, deleteLocationController.handle)
authRoutes.get('/me', ensureAuthenticated, fetchUserDataController.handle)
authRoutes.post('/save-envio', ensureAuthenticated, saveEnvioController.handle)
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
authRoutes.get('/tipos', ensureIsAdmin, fetchTiposController.handle)
authRoutes.post('/tipos', ensureIsAdmin, createTipoController.handle)
authRoutes.delete('/tipos', ensureIsAdmin, deleteTipoController.handle)
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

authRoutes.post('/upload-image', uploadImageController.handle)

authRoutes.get('/users', ensureIsAdmin, fetchUsersController.handle)
authRoutes.put('/users', ensureIsAdmin, updateUserController.handle)
authRoutes.delete('/users', ensureIsAdmin, deleteUserController.handle)

export { authRoutes }
