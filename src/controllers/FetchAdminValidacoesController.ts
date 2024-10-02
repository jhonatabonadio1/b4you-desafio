import { Request, Response } from 'express'

import { FetchAdminValidacoesService } from '../services/FetchAdminValidacoesService'

class FetchAdminValidacoesController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchAdminValidacoesService = new FetchAdminValidacoesService()

    const validacoes = await fetchAdminValidacoesService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(validacoes)
  }
}

export { FetchAdminValidacoesController }
