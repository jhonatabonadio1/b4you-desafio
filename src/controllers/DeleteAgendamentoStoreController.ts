import { Request, Response } from 'express'

import { DeleteAgendamentoStoreService } from '../services/DeleteAgendamentoStoreService'

class DeleteAgendamentoStoreController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { userId } = request

    const deleteUserService = new DeleteAgendamentoStoreService()

    const veiculo = await deleteUserService.execute({
      usuarioId: userId,
      id,
    })

    return response.json(veiculo)
  }
}

export { DeleteAgendamentoStoreController }
