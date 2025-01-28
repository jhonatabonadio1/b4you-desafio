import { Request, Response } from 'express'
import { SearchImovelService } from '../../../services/common/imoveis/SearchImovelService'

class SearchImovelController {
  async handle(request: Request, response: Response) {
    const { imovelCode } = request.query

    const searchImovelService = new SearchImovelService()

    try {
      const imovel = await searchImovelService.execute(imovelCode as string)
      return response.status(200).json(imovel)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SearchImovelController }
