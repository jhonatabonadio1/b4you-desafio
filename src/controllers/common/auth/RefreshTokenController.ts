import { Request, Response } from 'express'
import { RefreshTokenService } from '../../../services/common/auth/RefreshTokenService'

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const { refreshToken } = request.body

    const refreshTokenService = new RefreshTokenService()

    try {
      const tokens = await refreshTokenService.execute(refreshToken)

      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/token/refresh',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })

      return response.status(200).json({ accessToken: tokens.accessToken })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { RefreshTokenController }
