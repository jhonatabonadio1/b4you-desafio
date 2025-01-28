import { prismaClient } from '../../../database/prismaClient'

class FetchUserPropertyService {
  async execute(userId: string, propertyId: string) {
    if (!propertyId) {
      throw new Error('O ID da propriedade é obrigatório.')
    }

    // Busca a propriedade pelo ID
    const property = await prismaClient.properties.findUnique({
      where: {
        id: propertyId,
      },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada.')
    }

    // Verifica se a propriedade pertence ao usuário
    if (property.user !== userId) {
      throw new Error('Você não tem permissão para acessar esta propriedade.')
    }

    return property
  }
}

export { FetchUserPropertyService }
