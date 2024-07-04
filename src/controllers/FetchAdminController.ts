import { Request, Response } from 'express'
import { FetchAdminService } from '../services/FetchAdminService'

class FetchAdminController {
  async handle(request: Request, response: Response) {
    const { userId } = request

    const fetchAdminService = new FetchAdminService()

    const token = await fetchAdminService.execute({
      userId,
    })

    return response.json(token)
  }
}

export { FetchAdminController }
