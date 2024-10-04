import { Request, Response } from 'express'

import { FetchAdminUserVehiclesService } from '../services/FetchAdminUserVehiclesService'

class FetchAdminUserVehiclesController {
  async handle(request: Request, response: Response) {
    const { userId } = request.params

    const fetchVehicles = new FetchAdminUserVehiclesService()

    const vehicles = await fetchVehicles.execute({
      userId,
    })

    return response.json(vehicles)
  }
}

export { FetchAdminUserVehiclesController }
