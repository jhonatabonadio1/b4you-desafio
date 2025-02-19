/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { UpdateUserPasswordService } from '../../../services/common/users/UpdateUserPasswordService'

class UpdateUserPasswordController {
  async handle(request: Request, response: Response) {
    const { password, requestId } = request.body

    const updateUserPasswordService = new UpdateUserPasswordService()

    try {
      const result = await updateUserPasswordService.execute({
        requestId: requestId! as string,
        password,
      })
      return response.status(200).json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdateUserPasswordController }
