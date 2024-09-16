import { Request, Response } from 'express'
import { AvaliaAtendimentoService } from '../services/AvaliaAtendimentoService'

class AvaliaAtendimentoController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const { id } = request.params
    const { bomAtendimento, servicoCompleto, mensagem, estrelas } = request.body

    const avaliaAtendimento = new AvaliaAtendimentoService()

    const avalia = await avaliaAtendimento.execute({
      id,
      userId,
      bomAtendimento,
      servicoCompleto,
      mensagem,
      estrelas,
    })

    return response.json(avalia)
  }
}

export { AvaliaAtendimentoController }
