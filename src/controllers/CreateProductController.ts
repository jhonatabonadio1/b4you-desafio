import { Request, Response } from 'express'
import { CreateProductService } from '../services/CreateProductService'

class CreateProductController {
  async handle(request: Request, response: Response) {
    const {
      nome,
      imageUrl,
      prestadores,
      datasDisponiveis,
      preco,
      precoCarroGrande,
      precoCarroPequeno,
      ativo,
      opcoesAdicionais,
      exigeVeiculo,
    } = request.body

    const createProductService = new CreateProductService()

    const product = await createProductService.execute({
      nome,
      imageUrl,
      prestadores,
      datasDisponiveis,
      preco,
      precoCarroGrande,
      precoCarroPequeno,
      ativo,
      opcoesAdicionais,
      exigeVeiculo,
    })

    return response.json(product)
  }
}

export { CreateProductController }
