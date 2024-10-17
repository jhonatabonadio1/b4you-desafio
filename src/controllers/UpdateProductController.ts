import { Request, Response } from 'express'
import { UpdateProductService } from '../services/UpdateProductService'

class UpdateProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const {
      nome,
      imageUrl,
      prestadores,
      datasDisponiveis,
      preco,
      usoMensal,
      precoCarroGrande,
      precoCarroPequeno,
      ativo,
      opcoesAdicionais,
      diaResetLimite,
      exigeVeiculo,
    } = request.body

    const updateProductService = new UpdateProductService()

    const updatedProduct = await updateProductService.execute({
      id,
      nome,
      imageUrl,
      prestadores,
      datasDisponiveis,
      preco,
      usoMensal,
      precoCarroGrande,
      precoCarroPequeno,
      ativo,
      opcoesAdicionais,
      diaResetLimite,
      exigeVeiculo,
    })

    return response.json(updatedProduct)
  }
}

export { UpdateProductController }
