import { prismaClient } from '../database/prismaClient'

interface IRequest {
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

class FetchUserService {
  async execute({ usuarioId }: IRequest) {
    const user = await prismaClient.usuario.findUnique({
      where: { id: usuarioId, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    } else {
      const userWithoutPassword = exclude(user, ['password'])

      return userWithoutPassword
    }
  }
}

export { FetchUserService }
