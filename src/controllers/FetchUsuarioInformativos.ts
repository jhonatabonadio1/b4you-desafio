import { Request, Response } from 'express'

import { FetchUsuarioInformativosService } from '../services/FetchUsuarioInformativosService'

class FetchUsuarioInformativosController {
  async handle(request: Request, response: Response) {
    const fetchUserInformativosService = new FetchUsuarioInformativosService()

    const userInformativos = await fetchUserInformativosService.execute()

    return response.json(userInformativos)
  }
}

export { FetchUsuarioInformativosController }
