/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ReadCampaingService } from '../../../services/common/campaing/ReadCampaingService'

class ReadCampaingController {
  async handle(request: Request, response: Response) {
    const { userId } = request

    const readCampaingService = new ReadCampaingService()

    try {
      const campaing = await readCampaingService.execute({
        userId,
      })
      return response.status(201).json(campaing)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { ReadCampaingController }
