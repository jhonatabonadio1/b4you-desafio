/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { FetchMemberExistsService } from '../services/FetchMemberExistsService'

class FetchMemberExistsController {
  async handle(request: Request, response: Response) {
    const { matricula } = request.query

    const fetchMemberService = new FetchMemberExistsService()

    try {
      // Chama o serviço para buscar a matrícula
      const member = await fetchMemberService.execute(matricula as string)

      // Retorna os dados do membro se encontrado
      return response.status(200).json(member)
    } catch (error: any) {
      // Retorna erro caso a matrícula não seja encontrada
      return response.status(404).json({
        error: error.message,
      })
    }
  }
}

export { FetchMemberExistsController }
