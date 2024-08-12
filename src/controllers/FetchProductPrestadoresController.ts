import { Request, Response } from 'express'

import { FetchProductPrestadoresService } from '../services/FetchProductPrestadoresService'

class FetchProductPrestadoresController {
  async handle(request: Request, response: Response) {
    const { produtoId } = request.params
    const fetchProdutosService = new FetchProductPrestadoresService()

    const produto = await fetchProdutosService.execute({
      produtoId,
    })

    return response.json(produto)
  }
}

export { FetchProductPrestadoresController }
