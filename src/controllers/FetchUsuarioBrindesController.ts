import { Request, Response } from 'express'

import { FetchUsuarioBrindesService } from '../services/FetchUsuarioBrindesService'

class FetchUsuarioBrindesController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const fetchUsersService = new FetchUsuarioBrindesService()

    const user = await fetchUsersService.execute({
      userId,
    })

    return response.json(user)
  }
}

export { FetchUsuarioBrindesController }
