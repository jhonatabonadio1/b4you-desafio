/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'

import { FetchDocumentTrackingService } from '../../../services/common/tracking/FetchDocumentTrackingService'

class FetchDocumentTrackingController {
  async handle(request: Request, response: Response) {
    const fetchDocumentTrackingService = new FetchDocumentTrackingService()
    const { docId } = request.params
    const { userId } = request
    const { dataInicio, dataFim } = request.query

    try {
      const tracking = await fetchDocumentTrackingService.execute(
        docId,
        userId,
        dataInicio as string,
        dataFim as string,
      )
      return response.status(200).json(tracking)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { FetchDocumentTrackingController }
