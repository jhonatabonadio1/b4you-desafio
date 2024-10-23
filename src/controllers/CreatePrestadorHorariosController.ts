import { Request, Response } from 'express'

import { CreatePrestadorHorariosService } from '../services/CreatePrestadorHorariosService'

class CreatePrestadorHorariosController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const { data } = request.body
    const createPrestadorHorariosService = new CreatePrestadorHorariosService()

    const user = await createPrestadorHorariosService.execute({
      prestadorId: userId,
      data,
    })

    return response.json(user)
  }
}

export { CreatePrestadorHorariosController }
