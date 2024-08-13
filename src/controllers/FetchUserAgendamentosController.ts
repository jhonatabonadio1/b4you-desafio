import { Request, Response } from 'express'

import { FetchUserAgendamentosService } from '../services/FetchUserAgendamentosService'

class FetchUserAgendamentosController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const agendamentoService = new FetchUserAgendamentosService()

    const agendamento = await agendamentoService.execute({
      userId,
    })

    return response.json(agendamento)
  }
}

export { FetchUserAgendamentosController }
