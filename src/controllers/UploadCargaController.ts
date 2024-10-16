/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { UploadCargaService } from '../services/UploadCargaService'

class UploadCargaController {
  async handle(request: Request, response: Response) {
    const { file } = request // Arquivo processado pelo multer

    if (!file) {
      return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
    }

    const uploadCargaService = new UploadCargaService()

    try {
      // Executa o serviço de upload, incluindo o upload para o S3 e remoção do arquivo temporário
      const carga = await uploadCargaService.execute(
        file.path,
        file.originalname,
      )

      // Retorna os dados da carga criada
      return response.status(200).json(carga)
    } catch (error: any) {
      console.error('Erro no upload:', error)
      return response.status(500).json({
        error: 'Erro ao processar o upload',
        details: error.message,
      })
    }
  }
}

export { UploadCargaController }
