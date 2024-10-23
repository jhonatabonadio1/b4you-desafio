import { Request, Response } from 'express'
import { CreateProductService } from '../services/CreateProductService'

class CreateProductController {
  async handle(request: Request, response: Response) {
    const { file } = request
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

    const createProductService = new CreateProductService()

    const product = await createProductService.execute({
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

    return response.json(product)
  }
}

export { CreateProductController }
