import { Request, Response } from 'express'
import { CreatePrestadorService } from '../services/CreatePrestadorService'

class CreatePrestadorController {
  async handle(request: Request, response: Response) {
    const {
      bairro,
      cep,
      cidade,
      endereco,
      estado,
      inscricao,
      latitude,
      longitude,
      password,
      razaoSocial,
      tipoInscricao,
    } = request.body

    const createPrestadorService = new CreatePrestadorService()

    const user = await createPrestadorService.execute({
      bairro,
      cep,
      cidade,
      endereco,
      estado,
      inscricao,
      latitude,
      longitude,
      password,
      razaoSocial,
      tipoInscricao,
    })

    return response.json(user)
  }
}

export { CreatePrestadorController }
