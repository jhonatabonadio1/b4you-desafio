/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { SignInService } from '../../../services/common/auth/SignInService'

class SignInController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body

    const signInService = new SignInService()

    try {
      const result = await signInService.execute({ email, password })
      return response.json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SignInController }
