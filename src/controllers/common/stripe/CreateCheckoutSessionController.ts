/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateCheckoutSessionService } from '../../../services/common/stripe/CreateCheckoutSessionService'

class CreateCheckoutSessionController {
  async handle(request: Request, response: Response) {
    const { priceId } = request.body
    const { userId, ip } = request

    const createCheckoutSessionService = new CreateCheckoutSessionService()

    try {
      const session = await createCheckoutSessionService.execute({
        priceId,
        userId,
        ip,
      })
      return response.status(200).json(session)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateCheckoutSessionController }
