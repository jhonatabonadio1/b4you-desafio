import { Request, Response } from 'express'
import { DeleteFonteService } from '../../../services/admin/fontes/DeleteFonteService'

class DeleteFontesController {
  async handle(request: Request, response: Response) {
    const { id } = request.body

    try {
      const deleteFontesService = new DeleteFonteService()
      const result = await deleteFontesService.execute(id)
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteFontesController }
