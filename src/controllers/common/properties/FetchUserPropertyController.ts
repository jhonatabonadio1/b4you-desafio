import { Request, Response } from 'express'
import { FetchUserPropertyService } from '../../../services/common/properties/FetchUserPropertyService'

class FetchUserPropertyController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
    const { propertyId } = request.query

    try {
      if (!propertyId || typeof propertyId !== 'string') {
        return response
          .status(400)
          .json({ message: 'ID da propriedade inválido.' })
      }

      const fetchUserPropertyService = new FetchUserPropertyService()

      const property = await fetchUserPropertyService.execute(
        userId,
        propertyId,
      )

      return response.status(200).json(property)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUserPropertyController }
