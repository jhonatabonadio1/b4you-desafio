import { Request, Response } from 'express'
import { FetchTiposService } from '../../../services/admin/tipos/FetchTiposService'

class FetchTiposController {
  async handle(request: Request, response: Response) {
    try {
      const fetchTiposService = new FetchTiposService()
      const tipos = await fetchTiposService.execute()
      return response.status(200).json(tipos)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchTiposController }
