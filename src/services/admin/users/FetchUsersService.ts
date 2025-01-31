import { prismaClient } from '../../../database/prismaClient'

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class FetchUsersService {
  async execute(id?: string) {
    if (id) {
      const user = await prismaClient.users.findFirst({
        where: { id, deleted: false },
      })

      if (!user) {
        throw new Error('Usuário não encontrado.')
      }

      return exclude(user, ['password'])
    }

    const users = await prismaClient.users.findMany()

    return users
  }
}

export { FetchUsersService }
