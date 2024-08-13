import { Request, Response } from 'express'
import { CreateAgendamentoService } from '../services/CreateAgendamentoService'

class CreateAgendamentoController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const { servicoId, horario, prestadorId, veiculoId, opcaoAdicionalId } =
      request.body

    const createBrindeService = new CreateAgendamentoService()

    const brinde = await createBrindeService.execute({
      userId,
      servicoId,
      horario,
      veiculoId,
      prestadorId,
      opcaoAdicionalId,
    })

    return response.json(brinde)
  }
}

export { CreateAgendamentoController }
