import { Request, Response } from 'express'
import { FetchFilesService } from '../../../services/common/files/FetchFilesService'

class FetchFilesController {
  async handle(req: Request, res: Response) {
    const { userId } = req
    const { search } = req.query

    const fetchFilesService = new FetchFilesService()

    try {
      const files = await fetchFilesService.execute(userId, search as string)

      return res.status(200).json({ success: true, data: files })
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }
}

export { FetchFilesController }
