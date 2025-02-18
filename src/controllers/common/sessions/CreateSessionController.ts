/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateSessionService } from '../../../services/common/sessions/CreateSessionService'

class CreateSessionController {
  async handle(request: Request, response: Response) {
    const { docId } = request.body

    const createSessionService = new CreateSessionService()
    const { ip } = request
    const userAgent = request.headers['user-agent'] || 'Unknown-Device'

    try {
      const session = await createSessionService.execute({
        docId,
        fingerprint: userAgent,
        network: ip as string,
      })

      return response.status(201).json(session)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateSessionController }
