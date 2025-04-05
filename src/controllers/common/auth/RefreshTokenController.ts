import { Request, Response } from 'express'
import { RefreshTokenService } from '../../../services/common/auth/RefreshTokenService'

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const { refreshToken } = request.body

    const refreshTokenService = new RefreshTokenService()

    try {
      const tokens = await refreshTokenService.execute(refreshToken)
      return response.status(200).json(tokens)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { RefreshTokenController }
