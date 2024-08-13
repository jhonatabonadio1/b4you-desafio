import { Request, Response } from 'express'

import { FetchAgendamentosService } from '../services/FetchAgendamentosService'

class FetchAgendamentosController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchAgendamentosService = new FetchAgendamentosService()

    const agendamento = await fetchAgendamentosService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(agendamento)
  }
}

export { FetchAgendamentosController }
