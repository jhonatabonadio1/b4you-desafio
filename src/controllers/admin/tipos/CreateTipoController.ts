import { Request, Response } from 'express'
import { CreateTipoService } from '../../../services/admin/tipos/CreateTipoService'

class CreateTipoController {
  async handle(request: Request, response: Response) {
    const { nome } = request.body

    try {
      const createTipoService = new CreateTipoService()
      const tipo = await createTipoService.execute(nome)
      return response.status(201).json(tipo)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateTipoController }
