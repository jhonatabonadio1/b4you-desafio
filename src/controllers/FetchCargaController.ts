import { Request, Response } from 'express'

import { FetchCargaService } from '../services/FetchCargaService'

class FetchCargaController {
  async handle(request: Request, response: Response) {
    const fetchCargaService = new FetchCargaService()

    const carga = await fetchCargaService.execute()

    return response.json(carga)
  }
}

export { FetchCargaController }
