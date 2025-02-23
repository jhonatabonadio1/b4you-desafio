/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreatePortalSessionService } from '../../../services/common/stripe/CreatePortalSessionService'

class CreatePortalSessionController {
  async handle(request: Request, response: Response) {
    const { userId } = request

    const createPortalSessionService = new CreatePortalSessionService()

    try {
      const session = await createPortalSessionService.execute({
        userId,
      })
      return response.status(200).json(session)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreatePortalSessionController }
