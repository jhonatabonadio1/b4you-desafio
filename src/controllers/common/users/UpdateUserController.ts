/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { UpdateUserService } from '../../../services/common/users/UpdateUserService'

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const { email, password, firstName, lastName, empresa } = request.body

    const updateUserService = new UpdateUserService()

    try {
      const result = await updateUserService.execute({
        userId,
        email,
        password,
        firstName,
        lastName,
        empresa,
      })
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdateUserController }
