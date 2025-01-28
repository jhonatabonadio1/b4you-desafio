import { Request, Response } from 'express'
import { UpdateUserService } from '../../../services/admin/users/UpdateUserService'

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.query
    const { email, nome, role, password } = request.body

    try {
      const updateUserService = new UpdateUserService()
      const updatedUser = await updateUserService.execute(id as string, {
        email,
        nome,
        role,
        password,
      })

      return response.status(200).json(updatedUser)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdateUserController }
