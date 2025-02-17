/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { FetchHeatmapsService } from '../../../services/common/heatmaps/FetchHeatmapsService'

class FetchHeatmapsController {
  async handle(request: Request, response: Response) {
    const { docId, page } = request.params
    const { userId } = request

    const fetchHeatmapsService = new FetchHeatmapsService()

    try {
      const heatmaps = await fetchHeatmapsService.execute({
        docId,
        page: parseFloat(page),
        userId,
      })
      return response.status(201).json(heatmaps)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchHeatmapsController }
