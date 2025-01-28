/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ListAllPropertiesService } from '../../../services/common/properties/ListAllPropertiesService'

class ListAllPropertiesController {
  async handle(request: Request, response: Response) {
    const service = new ListAllPropertiesService()

    try {
      const properties = await service.execute()

      return response.status(200).json(properties)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { ListAllPropertiesController }
