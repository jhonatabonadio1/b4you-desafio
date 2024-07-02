import { Request, Response } from 'express'

import { ReadPrestadorService } from '../services/ReadPrestadorSevice'

class ReadPrestadorController {
  async handle(request: Request, response: Response) {
    const { prestadorId } = request.params

    const updatePrestadorService = new ReadPrestadorService()

    const user = await updatePrestadorService.execute({
      prestadorId,
    })

    return response.json(user)
  }
}

export { ReadPrestadorController }
