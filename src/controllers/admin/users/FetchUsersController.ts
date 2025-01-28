import { Request, Response } from 'express'
import { FetchUsersService } from '../../../services/admin/users/FetchUsersService'

class FetchUsersController {
  async handle(request: Request, response: Response) {
    const { id } = request.query

    try {
      const fetchUsersService = new FetchUsersService()
      const users = await fetchUsersService.execute(id as string)

      return response.status(200).json(users)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUsersController }
