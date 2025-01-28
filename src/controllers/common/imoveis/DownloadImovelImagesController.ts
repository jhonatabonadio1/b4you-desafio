import { Request, Response } from 'express'
import { DownloadImovelImagesService } from '../../../services/common/imoveis/DownloadImovelImagesService'

class DownloadImovelImagesController {
  async handle(request: Request, response: Response) {
    const { imovelCode } = request.query

    const downloadImovelImagesService = new DownloadImovelImagesService()

    try {
      if (!imovelCode || typeof imovelCode !== 'string') {
        return response
          .status(400)
          .json({ message: 'Código do imóvel inválido.' })
      }

      const zipContent = await downloadImovelImagesService.execute(imovelCode)

      response.setHeader('Content-Type', 'application/zip')
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=imagens_imovel_${imovelCode}.zip`,
      )

      response.send(zipContent)
    } catch (error: any) {
      response.status(500).json({ error: error.message })
    }
  }
}

export { DownloadImovelImagesController }
