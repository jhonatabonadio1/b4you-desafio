import { Request, Response } from 'express'
import { DeleteImovelService } from '../../../services/common/imoveis/DeleteImovelService'

class DeleteImovelController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const { userId } = request

    try {
      const deleteImovelService = new DeleteImovelService()

      const result = await deleteImovelService.execute(id, userId)

      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteImovelController }
