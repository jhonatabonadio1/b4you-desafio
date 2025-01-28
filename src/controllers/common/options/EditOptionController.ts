import { Request, Response } from 'express'
import { EditOptionService } from '../../../services/common/options/EditOptionService'

class EditOptionController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const { linkId } = request.query
    const { userId } = request // Obtido do middleware de autenticação
    const data = request.body

    try {
      if (
        !id ||
        !linkId ||
        typeof id !== 'string' ||
        typeof linkId !== 'string'
      ) {
        return response.status(400).json({
          message:
            'IDs de propriedade e link são obrigatórios e devem ser strings.',
        })
      }

      const editOptionService = new EditOptionService()

      const result = await editOptionService.execute(userId, id, linkId, data)

      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { EditOptionController }
