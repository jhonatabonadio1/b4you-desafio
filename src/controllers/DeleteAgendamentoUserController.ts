import { Request, Response } from 'express'

import { DeleteAgendamentoUserService } from '../services/DeleteAgendamentoUserService'

class DeleteAgendamentoUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const { userId } = request

    const deleteUserService = new DeleteAgendamentoUserService()

    const veiculo = await deleteUserService.execute({
      usuarioId: userId,
      id,
    })

    return response.json(veiculo)
  }
}

export { DeleteAgendamentoUserController }
