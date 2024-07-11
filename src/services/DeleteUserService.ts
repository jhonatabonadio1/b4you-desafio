import { prismaClient } from '../database/prismaClient'

interface IUser {
  usuarioId: string
}

// Exclude keys from user
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class DeleteUserService {
  async execute({ usuarioId }: IUser) {
    const user = await prismaClient.usuario.findUnique({
      where: { id: usuarioId, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    const updateUserService = await prismaClient.usuario.update({
      where: { id: user.id },
      data: {
        deleted: true,
      },
    })

    const userWithoutSensiveKeys = exclude(updateUserService, ['password'])
    return userWithoutSensiveKeys
  }
}

export { DeleteUserService }
