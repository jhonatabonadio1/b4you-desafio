import { Request, Response } from 'express'
import { FetchBrindeService } from '../services/FetchBrindeService'

class FetchBrindeController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const fetchBrindeService = new FetchBrindeService()

    const brinde = await fetchBrindeService.execute({
      id,
    })

    return response.json(brinde)
  }
}

export { FetchBrindeController }
