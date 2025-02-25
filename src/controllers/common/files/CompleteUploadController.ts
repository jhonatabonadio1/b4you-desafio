import { Request, Response } from 'express'

import { CompleteUploadService } from '../../../services/common/files/CompleteUploadService'

export class CompleteUploadController {
  // Método para iniciar o upload
  async handle(req: Request, res: Response) {
    try {
      const { userId } = req
      const { key, originalName, sizeInBytes } = req.body

      if (!key || !originalName || !sizeInBytes) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' })
      }

      if (!userId) {
        return res.status(400).json({ error: 'Usuário não especificado' })
      }

      const completeUploadService = new CompleteUploadService()

      const uploadFile = await completeUploadService.execute({
        originalName,
        sizeInBytes,
        userId,
        key,
      })

      return res.status(200).json(uploadFile)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao iniciar upload' })
    }
  }
}
