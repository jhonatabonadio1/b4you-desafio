import { Request, Response } from 'express'
import { ChangeUserAvatarService } from '../services/ChangeUserAvatarService'

class ChangeUserAvatarController {
  async handle(request: Request, response: Response) {
    const { tipoAcesso, imageUrl } = request.body

    const { userId } = request

    const changeUserAvatarService = new ChangeUserAvatarService()

    const userAvatar = await changeUserAvatarService.execute({
      tipoAcesso,
      imageUrl,
      userId,
    })

    return response.json(userAvatar)
  }
}

export { ChangeUserAvatarController }
