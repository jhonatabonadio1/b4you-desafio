import { Request, Response } from 'express'

import { DeletePrestadorHorariosService } from '../services/DeletePrestadorHorariosService'

class DeletePrestadorHorariosController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const { data } = request.body
    const deletePrestadorHorariosService = new DeletePrestadorHorariosService()

    const user = await deletePrestadorHorariosService.execute({
      prestadorId: userId,
      data,
    })

    return response.json(user)
  }
}

export { DeletePrestadorHorariosController }
