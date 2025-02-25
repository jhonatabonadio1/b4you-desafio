import { Request, Response } from 'express'

import { GeneratePreSignedUrlService } from '../../../services/common/files/GeneratePreSignedUrlService'

export class GeneratePreSignedUrlController {
  // Método para iniciar o upload
  async handle(req: Request, res: Response) {
    try {
      const { userId } = req
      const { fileName, fileType, sizeInBytes } = req.body

      if (!fileName || !fileType || !sizeInBytes) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' })
      }

      if (!userId) {
        return res.status(400).json({ error: 'Usuário não especificado' })
      }

      const uploadFileService = new GeneratePreSignedUrlService()

      const uploadFile = await uploadFileService.execute({
        fileName,
        fileType,
        sizeInBytes,
        userId,
      })

      return res.status(200).json(uploadFile)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}
