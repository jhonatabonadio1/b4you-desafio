import { Request, Response } from 'express'
import { AuthAdminService } from '../services/AuthAdminService'

class AuthAdminController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body

    const authAdminService = new AuthAdminService()

    const token = await authAdminService.execute({
      email,
      password,
    })

    return response.json(token)
  }
}

export { AuthAdminController }
