import { Request, Response } from 'express'

import { FetchAdminValidacoesBrindesService } from '../services/FetchAdminValidacoesBrindesService'

class FetchAdminValidacoesBrindesController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchAdminValidacoesBrindesService =
      new FetchAdminValidacoesBrindesService()

    const validacoesBrindes = await fetchAdminValidacoesBrindesService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(validacoesBrindes)
  }
}

export { FetchAdminValidacoesBrindesController }
