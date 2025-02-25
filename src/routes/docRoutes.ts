/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express'

import { DeleteFileController } from '../controllers/common/files/DeleteFileController'
import { GetFileController } from '../controllers/common/files/GetFileController'
import { UploadFileController } from '../controllers/common/files/UploadFileController'
import { FetchFilesController } from '../controllers/common/files/FetchFilesController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { userInBlacklist } from '../middlewares/userInBlacklist'
import { CheckUploadStatusBatchController } from '../controllers/common/files/CheckUploadStatusBatchController'

const docRoutes = Router()

const getFileController = new GetFileController()

const uploadFileController = new UploadFileController()
const fetchFilesController = new FetchFilesController()
const deleteFileController = new DeleteFileController()
const checkUploadStatusBatchController = new CheckUploadStatusBatchController()

docRoutes.get('/file/:docId', userInBlacklist, getFileController.handle)

docRoutes.post(
  '/file',
  ensureAuthenticated,
  userInBlacklist,
  uploadFileController.handle,
)

docRoutes.get('/files', ensureAuthenticated, fetchFilesController.handle)

docRoutes.delete(
  '/files/:docId',
  ensureAuthenticated,
  userInBlacklist,
  deleteFileController.handle,
)

docRoutes.post(
  '/files/status',
  ensureAuthenticated,
  checkUploadStatusBatchController.handle,
)
export { docRoutes }
