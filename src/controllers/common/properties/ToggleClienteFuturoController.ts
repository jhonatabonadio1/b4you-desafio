import { Request, Response } from 'express'
import { ToggleClienteFuturoService } from '../../../services/common/properties/ToggleClienteFuturoService'

class ToggleClienteFuturoController {
  async handle(request: Request, response: Response) {
    const { id } = request.query

    const addClienteFuturoService = new ToggleClienteFuturoService()

    try {
      const clienteFuturo = await addClienteFuturoService.execute(id as string)
      return response.status(200).json({ clienteFuturo })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { ToggleClienteFuturoController }
