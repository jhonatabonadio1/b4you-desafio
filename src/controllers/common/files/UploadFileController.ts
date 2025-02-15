import { Request, Response } from 'express'
import { UploadFileService } from '../../../services/common/files/UploadFileService'

class UploadFileController {
  async handle(req: Request, res: Response) {
    const { file, userId } = req

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
    }

    const uploadFileService = new UploadFileService()

    const uploadFile = await uploadFileService.execute(
      file.path,
      file.originalname || '',
      userId,
    )

    return res.status(200).json(uploadFile)
  }
}

export { UploadFileController }
