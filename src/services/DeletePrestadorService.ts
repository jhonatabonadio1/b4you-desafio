import { prismaClient } from '../database/prismaClient'

interface IUser {
  prestadorId: string
}

// Exclude keys from user
function exclude<Prestador, Key extends keyof Prestador>(
  user: Prestador,
  keys: Key[],
): Omit<Prestador, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class DeletePrestadorService {
  async execute({ prestadorId }: IUser) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (!user) {
      throw new Error('Prestador não encontrado.')
    }

    const updateUserService = await prismaClient.prestador.update({
      where: { id: user.id },
      data: {
        deleted: true,
      },
    })

    const userWithoutSensiveKeys = exclude(updateUserService, ['password'])
    return userWithoutSensiveKeys
  }
}

export { DeletePrestadorService }
