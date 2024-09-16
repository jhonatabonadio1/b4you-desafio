import { Request, Response } from 'express'

import { DeleteAgendamentoService } from '../services/DeleteAgendamentoService'

class DeleteAgendamentoController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const deleteUserService = new DeleteAgendamentoService()

    const veiculo = await deleteUserService.execute({
      id,
    })

    return response.json(veiculo)
  }
}

export { DeleteAgendamentoController }
