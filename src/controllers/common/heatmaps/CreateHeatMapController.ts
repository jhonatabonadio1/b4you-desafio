/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateHeatmapService } from '../../../services/common/heatmaps/CreateHeatMapService'

class CreateHeatmapController {
  async handle(request: Request, response: Response) {
    const { files } = request
    const { docId, metadata } = request.body

    if (!files) {
      return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
    }

    try {
      const createHeatmapService = new CreateHeatmapService()

      const createHeatmap = await createHeatmapService.execute({
        docId,
        files: files as Express.Multer.File[],
        metadata,
      })

      return response.status(201).json(createHeatmap)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { CreateHeatmapController }
