import { Request, Response } from 'express'
import { CreateUserCargaService } from '../services/CreateUserCargaService'

class CreateUserCargaController {
  async handle(request: Request, response: Response) {
    const { cpf, email, matricula, nome, password, phone, birth } = request.body

    const createUserService = new CreateUserCargaService()

    const user = await createUserService.execute({
      cpf,
      email,
      matricula,
      nome,
      password,
      phone,
      birth,
    })

    return response.json(user)
  }
}

export { CreateUserCargaController }
