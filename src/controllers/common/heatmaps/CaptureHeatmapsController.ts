/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CaptureHeatmapsService } from '../../../services/common/heatmaps/CaptureHeatmapsService'

class CaptureHeatmapsController {
  async handle(request: Request, response: Response) {
    const { docId, lote, sessionId } = request.body

    const createHeatmapsService = new CaptureHeatmapsService()

    try {
      const heatmaps = await createHeatmapsService.execute({
        docId,
        lote,
        sessionId,
      })
      return response.status(201).json(heatmaps)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CaptureHeatmapsController }
