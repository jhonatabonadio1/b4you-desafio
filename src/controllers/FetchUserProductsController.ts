import { Request, Response } from 'express'

import { FetchUserProductsService } from '../services/FetchUserProductsService'

class FetchUserProductsController {
  async handle(request: Request, response: Response) {
    const fetchProductsService = new FetchUserProductsService()

    const product = await fetchProductsService.execute()

    return response.json(product)
  }
}

export { FetchUserProductsController }
