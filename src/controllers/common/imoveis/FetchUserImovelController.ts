import { Request, Response } from 'express'
import { FetchUserImovelService } from '../../../services/common/imoveis/FetchUserImovelService'

class FetchUserImovelController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
    const { imovelId } = request.query

    try {
      if (!imovelId || typeof imovelId !== 'string') {
        return response.status(400).json({ message: 'ID do imóvel inválido.' })
      }

      const fetchUserImovelService = new FetchUserImovelService()

      const property = await fetchUserImovelService.execute(userId, imovelId)

      return response.status(200).json(property)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUserImovelController }
