import { Request, Response } from 'express'
import { CreateAdminAgendamentoService } from '../services/CreateAdminAgendamentoService'

class CreateAdminAgendamentoController {
  async handle(request: Request, response: Response) {
    const {
      userId,
      servicoId,
      semValidade,
      horario,
      prestadorId,
      veiculoId,
      opcoesAdicionais,
    } = request.body

    const createBrindeService = new CreateAdminAgendamentoService()

    const brinde = await createBrindeService.execute({
      userId,
      servicoId,
      semValidade,
      horario,
      veiculoId,
      prestadorId,
      opcoesAdicionais,
    })

    return response.json(brinde)
  }
}

export { CreateAdminAgendamentoController }
