/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express'

import { DeleteFileController } from '../controllers/common/files/DeleteFileController'
import { GetFileController } from '../controllers/common/files/GetFileController'
import { GeneratePreSignedUrlController } from '../controllers/common/files/GeneratePreSignedUrlController'
import { FetchFilesController } from '../controllers/common/files/FetchFilesController'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'
import { userInBlacklist } from '../middlewares/userInBlacklist'
import { CompleteUploadController } from '../controllers/common/files/CompleteUploadController'

const docRoutes = Router()

const getFileController = new GetFileController()

const generatePreSignedUrlController = new GeneratePreSignedUrlController()
const fetchFilesController = new FetchFilesController()
const deleteFileController = new DeleteFileController()
const completeUploadController = new CompleteUploadController()

docRoutes.get('/file/:docId', userInBlacklist, getFileController.handle)

docRoutes.post(
  '/file/presign',
  ensureAuthenticated,
  userInBlacklist,
  generatePreSignedUrlController.handle,
)

docRoutes.post(
  '/file/complete',
  ensureAuthenticated,
  userInBlacklist,
  completeUploadController.handle,
)

docRoutes.get('/files', ensureAuthenticated, fetchFilesController.handle)

docRoutes.delete(
  '/files/:docId',
  ensureAuthenticated,
  userInBlacklist,
  deleteFileController.handle,
)

export { docRoutes }
