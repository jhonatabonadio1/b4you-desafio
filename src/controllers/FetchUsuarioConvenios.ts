import { Request, Response } from 'express'

import { FetchUsuarioConveniosService } from '../services/FetchUsuarioConveniosService'

class FetchUsuarioConveniosController {
  async handle(request: Request, response: Response) {
    const fetchUserConveniosService = new FetchUsuarioConveniosService()

    const userConvenios = await fetchUserConveniosService.execute()

    return response.json(userConvenios)
  }
}

export { FetchUsuarioConveniosController }
