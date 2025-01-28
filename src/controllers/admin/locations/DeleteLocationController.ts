import { Request, Response } from 'express'
import { DeleteLocationService } from '../../../services/admin/locations/DeleteLocationService'

class DeleteLocationController {
  async handle(request: Request, response: Response) {
    const { sigla, cidade } = request.body

    try {
      const deleteLocationService = new DeleteLocationService()
      const result = await deleteLocationService.execute(sigla, cidade)
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteLocationController }
