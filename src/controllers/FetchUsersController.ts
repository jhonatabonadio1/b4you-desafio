import { Request, Response } from 'express'

import { FetchUsersService } from '../services/FetchUsersService'

class FetchUsersController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchUsersService = new FetchUsersService()

    const user = await fetchUsersService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(user)
  }
}

export { FetchUsersController }
