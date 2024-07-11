import { Request, Response } from 'express'

import { UpdateUserService } from '../services/UpdateUserService'

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { usuarioId } = request.params
    const { matricula, email, cpf, phone, password, birth, nome, tipoAcesso } =
      request.body

    const updateUserService = new UpdateUserService()

    const user = await updateUserService.execute({
      usuarioId,
      matricula,
      cpf,
      phone,
      birth,
      nome,
      tipoAcesso,
      password,
      email,
    })

    return response.json(user)
  }
}

export { UpdateUserController }
