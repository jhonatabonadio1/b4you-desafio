import { Request, Response } from 'express'

import { FetchVehiclesService } from '../services/FetchVehiclesService'

class FetchVehiclesController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchVehiclesService = new FetchVehiclesService()

    const vehicle = await fetchVehiclesService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(vehicle)
  }
}

export { FetchVehiclesController }
