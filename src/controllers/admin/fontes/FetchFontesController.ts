import { Request, Response } from 'express'
import { FetchFontesService } from '../../../services/admin/fontes/FetchFontesService'

class FetchFontesController {
  async handle(request: Request, response: Response) {
    try {
      const fetchFontesService = new FetchFontesService()
      const fontes = await fetchFontesService.execute()
      return response.status(200).json(fontes)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchFontesController }
