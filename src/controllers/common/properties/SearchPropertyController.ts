/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { SearchPropertyService } from '../../../services/common/properties/SearchPropertyService'

class SearchPropertyController {
  async handle(request: Request, response: Response) {
    const { clientCode } = request.query

    const searchPropertyService = new SearchPropertyService()

    try {
      const property = await searchPropertyService.execute(clientCode as string)
      return response.status(200).json(property)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SearchPropertyController }
