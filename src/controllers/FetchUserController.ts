import { Request, Response } from 'express'

import { FetchUserService } from '../services/FetchUserService'

class FetchUserController {
  async handle(request: Request, response: Response) {
    const { usuarioId } = request.params

    const fetchUserService = new FetchUserService()

    const user = await fetchUserService.execute({
      usuarioId,
    })

    return response.json(user)
  }
}

export { FetchUserController }
