import { Request, Response } from 'express'
import { FetchLocationsService } from '../../../services/admin/locations/FetchLocationsService'

class FetchLocationsController {
  async handle(request: Request, response: Response) {
    try {
      const fetchLocationsService = new FetchLocationsService()
      const locations = await fetchLocationsService.execute()
      return response.status(200).json(locations)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchLocationsController }
