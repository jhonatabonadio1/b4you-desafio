import { prismaClient } from '../../../database/prismaClient'

class FetchUserPropertiesService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    // Busca todas as propriedades associadas ao usuário
    const properties = await prismaClient.properties.findMany({
      where: {
        user: userId,
        deleted: false, // Garante que propriedades deletadas não sejam retornadas
      },
    })

    if (!properties || properties.length === 0) {
      throw new Error('Nenhuma propriedade encontrada para este usuário.')
    }

    return properties
  }
}

export { FetchUserPropertiesService }
