import { Request, Response } from 'express'

import { FetchStoreAgendamentosService } from '../services/FetchStoreAgendamentosService'

class FetchStoreAgendamentosController {
  async handle(request: Request, response: Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { userId } = request
    const agendamentoService = new FetchStoreAgendamentosService()

    const agendamento = await agendamentoService.execute({
      storeId: userId,
    })

    return response.json(agendamento)
  }
}

export { FetchStoreAgendamentosController }
