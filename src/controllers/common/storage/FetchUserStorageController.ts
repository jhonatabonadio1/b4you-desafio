/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { FetchUserStorageService } from '../../../services/common/storage/FetchUserStorageService'

class FetchUserStorageController {
  async handle(request: Request, response: Response) {
    const fetchUserStorage = new FetchUserStorageService()
    const { userId } = request

    try {
      const storage = await fetchUserStorage.execute(userId)
      return response.status(200).json(storage)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { FetchUserStorageController }
