import { Request, Response } from 'express'

import { FetchInformativosService } from '../services/FetchInformativosService'

class FetchInformativosController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchInformativosService = new FetchInformativosService()

    const informativo = await fetchInformativosService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(informativo)
  }
}

export { FetchInformativosController }
