import { Request, Response } from 'express'

import { FetchVehicleService } from '../services/FetchVehicleService'

class FetchVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params
    const fetchUserConveniosService = new FetchVehicleService()

    const vehicle = await fetchUserConveniosService.execute({
      vehicleId,
    })

    return response.json(vehicle)
  }
}

export { FetchVehicleController }
