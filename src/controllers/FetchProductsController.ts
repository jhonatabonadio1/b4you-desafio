import { Request, Response } from 'express'

import { FetchProductsService } from '../services/FetchProductsService'

class FetchProductsController {
  async handle(request: Request, response: Response) {
    const { page, search } = request.query
    const fetchProdutosService = new FetchProductsService()

    const produto = await fetchProdutosService.execute({
      page: page ? Number(page) : 1,
      search: search ? search.toString() : undefined,
    })

    return response.json(produto)
  }
}

export { FetchProductsController }
