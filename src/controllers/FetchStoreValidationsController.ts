import { Request, Response } from 'express'

import { FetchStoreValidationsService } from '../services/FetchStoreValidationsService'

class FetchStoreValidationsController {
  async handle(request: Request, response: Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { userId } = request
    const validationsService = new FetchStoreValidationsService()

    const agendamento = await validationsService.execute({
      storeId: userId,
    })

    return response.json(agendamento)
  }
}

export { FetchStoreValidationsController }
