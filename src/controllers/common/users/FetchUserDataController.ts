import { Request, Response } from 'express'
import { FetchUserDataService } from '../../../services/common/users/FetchUserDataService'

class FetchUserDataController {
  async handle(request: Request, response: Response) {
    const { userId } = request

    try {
      const fetchUserDataService = new FetchUserDataService()

      const user = await fetchUserDataService.execute(userId)

      return response.status(200).json(user)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchUserDataController }
