import { Request, Response } from 'express'
import { FetchAvaliacoesPendentesService } from '../services/FetchAvaliacoesPendentesService'

class FetchAvaliacoesPendentesController {
  async handle(request: Request, response: Response) {
    const { userId } = request

    const fetchAvaliacoes = new FetchAvaliacoesPendentesService()

    const avaliacao = await fetchAvaliacoes.execute({
      userId,
    })

    return response.json(avaliacao)
  }
}

export { FetchAvaliacoesPendentesController }
