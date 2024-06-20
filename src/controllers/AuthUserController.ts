import { Request, Response } from 'express'
import { AuthUserService } from '../services/AuthUserService'

class AuthUserController {
  async handle(request: Request, response: Response) {
    const { login, password, accessType } = request.body

    const authUserService = new AuthUserService()

    const token = await authUserService.execute({
      matricula: login,
      password,
      accessType,
    })

    return response.json(token)
  }
}

export { AuthUserController }
