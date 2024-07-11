import { Request, Response } from 'express'
import { DeleteInformativoService } from '../services/DeleteInformativoService'

class DeleteInformativoController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteInformativoService = new DeleteInformativoService()

    const informativo = await deleteInformativoService.execute({
      id,
    })

    return response.json(informativo)
  }
}

export { DeleteInformativoController }
