import { Request, Response } from 'express'
import { CreateUserService } from '../services/CreateUserService'

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { cpf, email, matricula, nome, password, phone } = request.body

    const createUserService = new CreateUserService()

    const user = await createUserService.execute({
      cpf,
      email,
      matricula,
      nome,
      password,
      phone,
    })

    return response.json(user)
  }
}

export { CreateUserController }
