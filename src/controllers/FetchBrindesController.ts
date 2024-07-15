import { Request, Response } from 'express'

import { FetchBrindesService } from '../services/FetchBrindesService'

class FetchBrindesController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchBrindesService = new FetchBrindesService()

    const brinde = await fetchBrindesService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(brinde)
  }
}

export { FetchBrindesController }
