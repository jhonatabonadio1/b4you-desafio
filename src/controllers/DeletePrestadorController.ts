import { Request, Response } from 'express'

import { DeletePrestadorService } from '../services/DeletePrestadorService'

class DeletePrestadorController {
  async handle(request: Request, response: Response) {
    const { prestadorId } = request.params

    const deletePrestadorService = new DeletePrestadorService()

    const user = await deletePrestadorService.execute({
      prestadorId,
    })

    return response.json(user)
  }
}

export { DeletePrestadorController }
