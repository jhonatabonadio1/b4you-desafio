import { prismaClient } from '../database/prismaClient'

interface IRequest {
  tipoAcesso: number
  userId: string
  imageUrl: string
}

class ChangeUserAvatarService {
  async execute({ tipoAcesso, userId, imageUrl }: IRequest) {
    let user
    if (tipoAcesso === 1) {
      user = await prismaClient.usuario.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
      })
    } else {
      user = await prismaClient.prestador.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
      })
    }

    if (!user) {
      throw new Error('Usuário não encontrado/inválido.')
    }

    const atualizaUsuario = await prismaClient.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        avatarUrl: imageUrl,
      },
    })

    return atualizaUsuario
  }
}

export { ChangeUserAvatarService }
