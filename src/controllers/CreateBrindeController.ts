import { Request, Response } from 'express'
import { CreateBrindeService } from '../services/CreateBrindeService'

class CreateBrindeController {
  async handle(request: Request, response: Response) {
    const {
      titulo,
      texto,
      dataDisponibilidade,
      dataLimite,
      prestadores,
      todosPrestadores,
      todosUsuarios,
      usuarios,
      imageUrl,
      ativo,
    } = request.body

    const createBrindeService = new CreateBrindeService()

    const brinde = await createBrindeService.execute({
      titulo,
      texto,
      dataDisponibilidade,
      dataLimite,
      prestadores,
      todosPrestadores,
      todosUsuarios,
      usuarios,
      imageUrl,
      ativo,
    })

    return response.json(brinde)
  }
}

export { CreateBrindeController }
