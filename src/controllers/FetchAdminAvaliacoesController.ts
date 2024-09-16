import { Request, Response } from 'express'

import { FetchAdminAvaliacoesService } from '../services/FetchAdminAvaliacoesService'

class FetchAdminAvaliacoesController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchAdminAvaliacoesService = new FetchAdminAvaliacoesService()

    const avaliacoes = await fetchAdminAvaliacoesService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(avaliacoes)
  }
}

export { FetchAdminAvaliacoesController }
