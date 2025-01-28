/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ListAllImoveisService } from '../../../services/common/imoveis/ListAllImoveisService'

class ListAllImoveisController {
  async handle(request: Request, response: Response) {
    const listAllImoveisService = new ListAllImoveisService()

    try {
      const result = await listAllImoveisService.execute()
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { ListAllImoveisController }
