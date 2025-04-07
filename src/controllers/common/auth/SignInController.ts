/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { SignInService } from '../../../services/common/auth/SignInService'

class SignInController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body

    const signInService = new SignInService()

    try {
      const result = await signInService.execute({ email, password })
      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/token/refresh',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })

      return response.json({ accessToken: result.refreshToken })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SignInController }
