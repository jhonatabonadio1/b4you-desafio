import { prismaClient } from '../database/prismaClient'

interface IRequest {
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

class FetchPrestadorService {
  async execute({ prestadorId }: IRequest) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (user) {
      const userWithoutPassword = exclude(user, ['password'])

      return userWithoutPassword
    }
  }
}

export { FetchPrestadorService }
