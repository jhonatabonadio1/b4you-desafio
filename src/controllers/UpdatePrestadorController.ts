import { Request, Response } from 'express'

import { UpdatePrestadorService } from '../services/UpdatePrestadorService'

class UpdatePrestadorController {
  async handle(request: Request, response: Response) {
    const { prestadorId } = request.params
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
      email,
    } = request.body

    const updatePrestadorService = new UpdatePrestadorService()

    const user = await updatePrestadorService.execute({
      prestadorId,
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
      email,
    })

    return response.json(user)
  }
}

export { UpdatePrestadorController }
