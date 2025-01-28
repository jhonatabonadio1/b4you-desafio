/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateUserService } from '../../../services/admin/auth/CreateUserService'

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { email, password, nome, role } = request.body
    const token = request.headers.authorization?.split(' ')[1]

    const createUserService = new CreateUserService()

    try {
      const result = await createUserService.execute({
        email,
        password,
        nome,
        role,
        token,
      })
      return response.status(201).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateUserController }
