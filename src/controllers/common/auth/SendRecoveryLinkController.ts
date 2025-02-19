/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { SendRecoveryLinkService } from '../../../services/common/auth/SendRecoveryLinkService'

class SendRecoveryLinkController {
  async handle(request: Request, response: Response) {
    const { email } = request.body

    const sendRecoveryLnk = new SendRecoveryLinkService()

    try {
      const result = await sendRecoveryLnk.execute({
        email,
      })
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SendRecoveryLinkController }
