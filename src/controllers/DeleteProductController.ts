import { Request, Response } from 'express'

import { DeleteProductService } from '../services/DeleteProductService'

class DeleteProductController {
  async handle(request: Request, response: Response) {
    const { produtoId } = request.params

    const deleteProdutoService = new DeleteProductService()

    const user = await deleteProdutoService.execute({
      produtoId,
    })

    return response.json(user)
  }
}

export { DeleteProductController }
