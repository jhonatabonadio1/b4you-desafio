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
      },
    })

    if (!properties || properties.length === 0) {
      throw new Error('Nenhuma propriedade encontrada para este usuário.')
    }

    const data = await Promise.all(
      properties.map(async (property) => {
        const user = await prismaClient.users.findFirst({
          where: { id: property.user, deleted: false },
        })

        return {
          ...property,
          userName: user?.nome || 'Usuário Desconhecido', // Adiciona o nome do usuário
        }
      }),
    )

    return data
  }
}

export { FetchUserPropertiesService }
