import { Request, Response } from 'express'
import { DeleteImageService } from '../../../services/common/images/DeleteImageService'

class DeleteImageController {
  async handle(request: Request, response: Response) {
    const { imageUrl } = request.body

    const deleteImageService = new DeleteImageService()

    try {
      const message = await deleteImageService.execute(imageUrl)
      return response.status(200).json({ message })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { DeleteImageController }
