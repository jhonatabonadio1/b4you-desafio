import { Request, Response } from 'express'
import { DeleteBrindeService } from '../services/DeleteBrindeService'

class DeleteBrindeController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteBrindeService = new DeleteBrindeService()

    const brinde = await deleteBrindeService.execute({
      id,
    })

    return response.json(brinde)
  }
}

export { DeleteBrindeController }
