import { Request, Response } from 'express'
import { AuthUserService } from '../services/AuthUserService'

class AuthUserController {
  async handle(request: Request, response: Response) {
    const { matricula, password } = request.body

    const authUserService = new AuthUserService()

    const token = await authUserService.execute({
      matricula,
      password,
    })

    return response.json(token)
  }
}

export { AuthUserController }
