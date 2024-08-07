import { Request, Response } from 'express'

import { FetchUserVehicleService } from '../services/FetchUserVehicleService'

class FetchUserVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params
    const { userId } = request
    const fetchUserConveniosService = new FetchUserVehicleService()

    const vehicle = await fetchUserConveniosService.execute({
      vehicleId,
      userId,
    })

    return response.json(vehicle)
  }
}

export { FetchUserVehicleController }
