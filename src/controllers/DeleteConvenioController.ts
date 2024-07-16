import { Request, Response } from 'express'
import { DeleteConvenioService } from '../services/DeleteConvenioService'

class DeleteConvenioController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteConvenioService = new DeleteConvenioService()

    const convenio = await deleteConvenioService.execute({
      id,
    })

    return response.json(convenio)
  }
}

export { DeleteConvenioController }
