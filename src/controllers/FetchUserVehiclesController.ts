import { Request, Response } from 'express'

import { FetchUserVehiclesService } from '../services/FetchUserVehiclesService'

class FetchUserVehiclesController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const fetchVehiclesService = new FetchUserVehiclesService()

    const vehicle = await fetchVehiclesService.execute({
      userId,
    })

    return response.json(vehicle)
  }
}

export { FetchUserVehiclesController }
