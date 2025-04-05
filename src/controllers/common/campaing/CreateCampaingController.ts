/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateCampaingService } from '../../../services/common/campaing/CreateCampaingService'

class CreateCampaingController {
  async handle(request: Request, response: Response) {
    const { nome, orcamento, status } = request.body
    const { userId } = request

    const createCampaingService = new CreateCampaingService()

    try {
      const campaing = await createCampaingService.execute({
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

export { CreateCampaingController }
