import { Request, Response } from 'express'
import { DeleteTipoService } from '../../../services/admin/tipos/DeleteTipoService'

class DeleteTipoController {
  async handle(request: Request, response: Response) {
    const { id } = request.body

    try {
      const deleteTipoService = new DeleteTipoService()
      const result = await deleteTipoService.execute(id)
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteTipoController }
