import { Request, Response } from 'express'
import { UpdateBrindeService } from '../services/UpdateBrindeService'

class UpdateBrindeController {
  async handle(request: Request, response: Response) {
    const {
      titulo,
      imageUrl,
      texto,
      dataDisponibilidade,
      dataLimite,
      usuarios,
      prestadores,
      todosPrestadores,
      todosUsuarios,
      ativo,
    } = request.body
    const { id } = request.params

    const updateBrindeService = new UpdateBrindeService()

    const brinde = await updateBrindeService.execute({
      id,
      titulo,
      imageUrl,
      texto,
      dataDisponibilidade,
      dataLimite,
      usuarios,
      prestadores,
      todosPrestadores,
      todosUsuarios,
      ativo,
    })

    return response.json(brinde)
  }
}

export { UpdateBrindeController }
