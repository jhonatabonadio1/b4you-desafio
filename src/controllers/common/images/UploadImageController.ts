import { Request, Response } from 'express'
import { UploadImageService } from '../../../services/common/images/UploadImageService'

class UploadImageController {
  async handle(request: Request, response: Response) {
    const { file } = request // Arquivo processado pelo multer

    if (!file) {
      return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
    }

    const uploadImageService = new UploadImageService()

    try {
      const imageUrl = await uploadImageService.optimizeAndUpload(
        file.path,
        file.originalname || '',
      )
      return response.status(200).json({ imageUrl })
    } catch (error: any) {
      console.error(error)
      return response.status(500).json({
        message: 'Erro ao fazer upload da imagem',
        error: error.message,
      })
    }
  }
}

export { UploadImageController }
