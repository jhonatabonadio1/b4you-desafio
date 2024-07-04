import { prismaClient } from '../database/prismaClient'

interface IFetchAdminRequest {
  userId: string
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

class FetchAdminService {
  async execute({ userId }: IFetchAdminRequest) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        id: userId,
        deleted: false,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const userWithoutSensiveKeys = exclude(user, ['password'])

    const response = {
      ...userWithoutSensiveKeys,
    }

    return response
  }
}

export { FetchAdminService }
