import { Request, Response } from 'express'
import { FetchUserPropertiesService } from '../../../services/common/properties/FetchUserPropertiesService'

class FetchUserPropertiesController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação

    try {
      const fetchUserPropertiesService = new FetchUserPropertiesService()

      const properties = await fetchUserPropertiesService.execute(userId)

      return response.status(200).json(properties)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUserPropertiesController }
