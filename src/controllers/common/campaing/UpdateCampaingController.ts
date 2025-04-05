/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { UpdateCampaingService } from '../../../services/common/campaing/UpdateCampaingService'

class UpdateCampaingController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const { nome, orcamento, status } = request.body
    const { userId } = request

    const updateCampaingService = new UpdateCampaingService()

    try {
      const campaing = await updateCampaingService.execute({
        id,
        nome,
        orcamento,
        status,
        userId,
      })
      return response.status(201).json(campaing)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdateCampaingController }
