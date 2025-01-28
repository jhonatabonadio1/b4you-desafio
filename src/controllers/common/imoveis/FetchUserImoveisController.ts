import { Request, Response } from 'express'
import { FetchUserImoveisService } from '../../../services/common/imoveis/FetchUserImoveisService'

class FetchUserImoveisController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação

    try {
      const fetchUserImoveisService = new FetchUserImoveisService()

      const properties = await fetchUserImoveisService.execute(userId)

      return response.status(200).json(properties)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUserImoveisController }
