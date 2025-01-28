import { Request, Response } from 'express'
import { UploadImageService } from '../../../services/common/images/UploadImageService'
import formidable from 'formidable'

class UploadImageController {
  async handle(request: Request, response: Response) {
    const form = formidable({ multiples: false })
    const uploadImageService = new UploadImageService()

    form.parse(request, async (err: any, fields: any, files: any) => {
      if (err) {
        return response.status(500).json({
          message: 'Erro ao processar o formulário',
          error: err.message,
        })
      }

      const file = files.image as formidable.File

      if (!file.filepath) {
        return response.status(400).json({ message: 'Arquivo não encontrado' })
      }

      try {
        const imageUrl = await uploadImageService.optimizeAndUpload(
          file.filepath,
          file.originalFilename || '',
        )
        return response.status(200).json({ imageUrl })
      } catch (error: any) {
        console.error(error)
        return response.status(500).json({
          message: 'Erro ao fazer upload da imagem',
          error: error.message,
        })
      }
    })
  }
}

export { UploadImageController }
