import { Request, Response } from 'express'
import { FetchPagesAnalyticsService } from '../../../services/common/tracking/FetchPagesAnalyticsService'

export class FetchPageAnalyticsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { docId } = req.params
    const { userId } = req
    const { dataInicio, dataFim } = req.query

    const service = new FetchPagesAnalyticsService()

    try {
      const analytics = await service.execute(
        docId,
        userId,
        dataInicio as string,
        dataFim as string,
      )

      return res.status(200).json(analytics)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}
