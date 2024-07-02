import { Request, Response } from 'express'

import { FetchPrestadoresService } from '../services/FetchPrestadoresService'

class FetchPrestadoresController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchPrestadoresService = new FetchPrestadoresService()

    const user = await fetchPrestadoresService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(user)
  }
}

export { FetchPrestadoresController }
