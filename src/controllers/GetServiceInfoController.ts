import { Request, Response } from 'express'

import { GetServiceInfoService } from '../services/GetServiceInfoService'

class GetServiceInfoController {
  async handle(request: Request, response: Response) {
    const service = new GetServiceInfoService()
    const { id } = request.params

    const getService = await service.execute({ id })

    return response.json(getService)
  }
}

export { GetServiceInfoController }
