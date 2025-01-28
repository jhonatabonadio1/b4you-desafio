/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ListAllUsersService } from '../../../services/common/users/ListAllUsersService'

class ListAllUsersController {
  async handle(request: Request, response: Response) {
    const { search } = request.query

    const listAllUsersService = new ListAllUsersService()

    try {
      const users = await listAllUsersService.execute(search as string)
      return response.status(200).json({ success: true, data: users })
    } catch (error: any) {
      return response.status(500).json({ success: false, error: error.message })
    }
  }
}

export { ListAllUsersController }
