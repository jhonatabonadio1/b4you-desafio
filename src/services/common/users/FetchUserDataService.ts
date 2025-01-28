import { prismaClient } from '../../../database/prismaClient'

class FetchUserDataService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    // Busca o usuário no banco de dados sem incluir o campo de senha
    const user = await prismaClient.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nome: true,
        role: true,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    return user
  }
}

export { FetchUserDataService }
