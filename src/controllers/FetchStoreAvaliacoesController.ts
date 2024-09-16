import { Request, Response } from 'express'

import { FetchStoreAvaliacoesService } from '../services/FetchStoreAvaliacoesService'

class FetchStoreAvaliacoesController {
  async handle(request: Request, response: Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { userId } = request
    const agendamentoService = new FetchStoreAvaliacoesService()

    const agendamento = await agendamentoService.execute({
      storeId: userId,
    })

    return response.json(agendamento)
  }
}

export { FetchStoreAvaliacoesController }
