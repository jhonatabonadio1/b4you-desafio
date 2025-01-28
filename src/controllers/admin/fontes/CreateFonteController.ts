import { Request, Response } from 'express'
import { CreateFonteService } from '../../../services/admin/fontes/CreateFonteService'

class CreateFonteController {
  async handle(request: Request, response: Response) {
    const { nome } = request.body

    try {
      const createFonteService = new CreateFonteService()
      const fonte = await createFonteService.execute(nome)
      return response.status(201).json(fonte)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateFonteController }
