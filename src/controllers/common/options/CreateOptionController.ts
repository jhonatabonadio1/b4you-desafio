/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateOptionService } from '../../../services/common/options/CreateOptionService'

class CreateOptionController {
  async handle(request: Request, response: Response) {
    const token = request.headers.authorization?.split(' ')[1]
    const { id: propertyId } = request.params // ID da propriedade
    const { link, motivo, enviado } = request.body

    const createOptionService = new CreateOptionService()

    const { userId } = request

    try {
      const result = await createOptionService.execute({
        token,
        propertyId,
        link,
        motivo,
        encaminhado: enviado,
        userId,
      })
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateOptionController }
