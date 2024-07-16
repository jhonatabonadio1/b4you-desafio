import { Request, Response } from 'express'
import { FetchConvenioService } from '../services/FetchConvenioService'

class FetchConvenioController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const fetchConvenioService = new FetchConvenioService()

    const convenio = await fetchConvenioService.execute({
      id,
    })

    return response.json(convenio)
  }
}

export { FetchConvenioController }
