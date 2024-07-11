import { Request, Response } from 'express'
import { FetchInformativoService } from '../services/FetchInformativoService'

class FetchInformativoController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const fetchInformativoService = new FetchInformativoService()

    const informativo = await fetchInformativoService.execute({
      id,
    })

    return response.json(informativo)
  }
}

export { FetchInformativoController }
