import { Request, Response } from 'express'

import fs from 'fs/promises'
import { uploadQueue } from '../../../lib/uploadQueue'
import { ObjectId } from 'mongodb'

export class UploadFileController {
  // Método para iniciar o upload
  async handle(req: Request, res: Response) {
    try {
      const { file, userId } = req
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' })
      }

      if (!userId) {
        return res.status(400).json({ error: 'Usuário não especificado' })
      }

      const geraIdDoDocumento = new ObjectId().toHexString()

      const job = await uploadQueue.add('upload', {
        fileBuffer: file.buffer,
        originalName: file.originalname,
        fileId: geraIdDoDocumento,
        userId,
      })

      // Respondemos ao cliente com o jobId
      return res.json({
        message: 'Upload em processamento...',
        title: file.originalname,
        id: geraIdDoDocumento,
        jobId: job.id,
      })
    } catch (error) {
      console.error('Erro ao iniciar upload:', error)
      return res.status(500).json({ error: 'Erro ao iniciar upload' })
    }
  }
}
