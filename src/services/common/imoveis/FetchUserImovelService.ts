import { prismaClient } from '../../../database/prismaClient'

class FetchUserImovelService {
  async execute(userId: string, imovelId: string) {
    if (!imovelId) {
      throw new Error('O ID do imóvel é obrigatório.')
    }

    // Busca o imóvel pelo ID
    const property = await prismaClient.imovels.findUnique({
      where: {
        id: imovelId,
      },
    })

    if (!property) {
      throw new Error('Imóvel não encontrado.')
    }

    // Verifica se o imóvel pertence ao usuário
    if (property.user !== userId) {
      throw new Error('Você não tem permissão para acessar este imóvel.')
    }

    return property
  }
}

export { FetchUserImovelService }
