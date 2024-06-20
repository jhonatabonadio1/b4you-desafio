import { Request, Response } from 'express'
import { VerifyAuthMatriculaService } from '../services/VerifyAuthMatriculaService'

class VerifyAuthMatriculaController {
  async handle(request: Request, response: Response) {
    const { login, accessType } = request.body

    const verifyAuthMatriculaService = new VerifyAuthMatriculaService()

    const data = await verifyAuthMatriculaService.execute({
      matricula: login,
      accessType,
    })

    return response.json(data)
  }
}

export { VerifyAuthMatriculaController }
