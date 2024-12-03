import { Request, Response } from 'express'

import { DeleteAvaliacaoAdminService } from '../services/DeleteAvaliacaoAdminService'

class DeleteAvaliacaoAdminController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteAvaliacao = new DeleteAvaliacaoAdminService()

    const avaliacao = await deleteAvaliacao.execute({
      id,
    })

    return response.json(avaliacao)
  }
}

export { DeleteAvaliacaoAdminController }
