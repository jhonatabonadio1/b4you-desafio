import { Request, Response } from 'express'
import { DeletePropertyService } from '../../../services/common/properties/DeletePropertyService'

class DeletePropertyController {
  async handle(request: Request, response: Response) {
    const { id } = request.params // ID da propriedade
    const { userId } = request // ID do usuário, obtido no middleware de autenticação

    try {
      if (!id || typeof id !== 'string') {
        return response.status(400).json({ message: 'ID inválido.' })
      }

      const deletePropertyService = new DeletePropertyService()

      const result = await deletePropertyService.execute(id, userId)

      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeletePropertyController }
