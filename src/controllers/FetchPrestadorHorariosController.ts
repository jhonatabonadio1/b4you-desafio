import { Request, Response } from 'express'

import { FetchPrestadorHorariosService } from '../services/FetchPrestadorHorariosService'

class FetchPrestadorHorariosController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const fetchPrestadorHorariosService = new FetchPrestadorHorariosService()

    const user = await fetchPrestadorHorariosService.execute({
      prestadorId: userId,
    })

    return response.json(user)
  }
}

export { FetchPrestadorHorariosController }
