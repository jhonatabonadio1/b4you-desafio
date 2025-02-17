import { Router } from 'express'

import { DeleteFileController } from '../controllers/common/files/DeleteFileController'
import { GetFileController } from '../controllers/common/files/GetFileController'
import { UploadFileController } from '../controllers/common/files/UploadFileController'
import { FetchFilesController } from '../controllers/common/files/FetchFilesController'
import multer from 'multer'
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated'

const docRoutes = Router()

const getFileController = new GetFileController()

const uploadFileController = new UploadFileController()
const fetchFilesController = new FetchFilesController()
const deleteFileController = new DeleteFileController()

const upload = multer({ dest: 'uploads/' })

docRoutes.get('/file/:docId', getFileController.handle)

docRoutes.post(
  '/file',
  ensureAuthenticated,
  upload.single('file'),
  uploadFileController.handle,
)
docRoutes.get('/files', ensureAuthenticated, fetchFilesController.handle)
docRoutes.delete(
  '/files/:docId',
  ensureAuthenticated,
  deleteFileController.handle,
)
export { docRoutes }
