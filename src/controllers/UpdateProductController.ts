import { Request, Response } from 'express'
import { UpdateProductService } from '../services/UpdateProductService'

class UpdateProductController {
  async handle(request: Request, response: Response) {
    const { file } = request
    const { id } = request.params
    const {
      nome,
      prestadores,
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
      fileName: file?.filename,
      filePath: file?.path,
      prestadores: prestadores ? JSON.parse(prestadores) : [],
      preco,
      usoMensal: Number(usoMensal),
      precoCarroGrande,
      precoCarroPequeno,
      ativo: ativo === 'true',
      opcoesAdicionais: opcoesAdicionais ? JSON.parse(opcoesAdicionais) : [],
      diaResetLimite: Number(diaResetLimite),
      exigeVeiculo: exigeVeiculo === 'true',
    })

    return response.json(updatedProduct)
  }
}

export { UpdateProductController }
