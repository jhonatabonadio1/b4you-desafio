import { Request, Response } from 'express'
import { FetchHeatmapService } from '../../../services/common/heatmaps/FetchHeatMapService'

export class FetchHeatmapController {
  async handle(req: Request, res: Response) {
    try {
      const { page } = req.query
      const { docId } = req.params

      if (!docId || !page) {
        return res.status(400).json({ error: 'docId e page são obrigatórios' })
      }

      const fetchHeatmapService = new FetchHeatmapService()
      const finalImage = await fetchHeatmapService.execute({
        docId: docId.toString(),
        page: Number(page),
      })

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': finalImage.length,
      })
      res.end(finalImage)
    } catch (error) {
      console.error('Erro ao buscar heatmap:', error)
      res.status(500).json({ error: 'Erro ao buscar heatmap' })
    }
  }
}
