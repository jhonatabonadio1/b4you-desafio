/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'

import { CreatePageViewService } from '../../../services/common/tracking/CreatePageViewService'

class CreatePageViewController {
  async handle(request: Request, response: Response) {
    const createPageViewService = new CreatePageViewService()
    const { sessionId } = request.params

    const { interactionTime, pageNumber } = request.body

    const { ip } = request
    const userAgent = request.headers['user-agent'] || 'Unknown-Device'

    try {
      const pageView = await createPageViewService.execute({
        sessionId,
        fingerprint: userAgent,
        interactionTime,
        network: ip as string,
        pageNumber,
      })
      return response.status(200).json(pageView)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { CreatePageViewController }
