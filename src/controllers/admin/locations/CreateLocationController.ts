import { Request, Response } from 'express'
import { CreateLocationService } from '../../../services/admin/locations/CreateLocationService'

class CreateLocationController {
  async handle(request: Request, response: Response) {
    const { sigla, cidade } = request.body

    try {
      const createLocationService = new CreateLocationService()
      const result = await createLocationService.execute(sigla, cidade)
      return response.status(201).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateLocationController }
