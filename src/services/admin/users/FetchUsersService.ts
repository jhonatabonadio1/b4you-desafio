import { prismaClient } from '../../../database/prismaClient'

class FetchUsersService {
  async execute(id?: string) {
    if (id) {
      const user = await prismaClient.users.findUnique({
        where: { id },
      })

      if (!user) {
        throw new Error('Usuário não encontrado.')
      }

      return user
    }

    const users = await prismaClient.users.findMany()

    return users
  }
}

export { FetchUsersService }
