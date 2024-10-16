import { Request, Response } from 'express'
import { DeleteCargaService } from '../services/DeleteCargaService'

class DeleteCargaController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteCargaService = new DeleteCargaService()

    const convenio = await deleteCargaService.execute({
      id,
    })

    return response.json(convenio)
  }
}

export { DeleteCargaController }
