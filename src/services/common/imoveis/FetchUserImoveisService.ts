import { prismaClient } from '../../../database/prismaClient'

class FetchUserImoveisService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    // Busca todos os imóveis associados ao usuário
    const properties = await prismaClient.imovels.findMany({
      where: {
        user: userId,
      },
    })

    return properties
  }
}

export { FetchUserImoveisService }
