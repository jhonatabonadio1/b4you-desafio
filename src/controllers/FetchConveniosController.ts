import { Request, Response } from 'express'

import { FetchConveniosService } from '../services/FetchConveniosService'

class FetchConveniosController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchConveniosService = new FetchConveniosService()

    const convenio = await fetchConveniosService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(convenio)
  }
}

export { FetchConveniosController }
