import { Request, Response } from 'express'
import { DeleteUserService } from '../../../services/admin/users/DeleteUserService'

class DeleteUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.query

    try {
      const deleteUserService = new DeleteUserService()
      const result = await deleteUserService.execute(id as string)

      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteUserController }
