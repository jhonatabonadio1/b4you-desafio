import { Request, Response } from 'express'

import { FetchPrestadorService } from '../services/FetchPrestadorService'

class FetchPrestadorController {
  async handle(request: Request, response: Response) {
    const { prestadorId } = request.params

    const updatePrestadorService = new FetchPrestadorService()

    const user = await updatePrestadorService.execute({
      prestadorId,
    })

    return response.json(user)
  }
}

export { FetchPrestadorController }
