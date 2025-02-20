/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { VerifyCheckoutSessionExistsService } from '../../../services/common/stripe/VerifyCheckoutSessionExistsService'

class VerifyCheckoutSessionExistsController {
  async handle(request: Request, response: Response) {
    const { sessionId } = request.params
    const { userId } = request

    const verifyCheckoutSessionExistsService =
      new VerifyCheckoutSessionExistsService()

    try {
      const session = await verifyCheckoutSessionExistsService.execute({
        sessionId,
        userId,
      })
      return response.status(200).json(session)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { VerifyCheckoutSessionExistsController }
