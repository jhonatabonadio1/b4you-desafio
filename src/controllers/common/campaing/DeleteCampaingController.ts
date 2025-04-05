/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { DeleteCampaingService } from '../../../services/common/campaing/DeleteCampaingService'

class DeleteCampaingController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const { userId } = request

    const deleteCampaingService = new DeleteCampaingService()

    try {
      const campaing = await deleteCampaingService.execute({
        id,
        userId,
      })
      return response.status(201).json(campaing)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteCampaingController }
