import { Request, Response } from 'express'

import { DeleteUserService } from '../services/DeleteUserService'

class DeleteUserController {
  async handle(request: Request, response: Response) {
    const { usuarioId } = request.params

    const deleteUserService = new DeleteUserService()

    const user = await deleteUserService.execute({
      usuarioId,
    })

    return response.json(user)
  }
}

export { DeleteUserController }
