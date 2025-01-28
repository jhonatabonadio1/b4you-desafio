import { prismaClient } from '../../../database/prismaClient'

class SearchImovelService {
  async execute(imovelCode: string) {
    if (!imovelCode) {
      throw new Error('O código do imóvel é obrigatório.')
    }

    // Busca o imóvel pelo código
    const imovel = await prismaClient.imovels.findFirst({
      where: {
        imovelCode,
      },
    })

    if (!imovel) {
      throw new Error('Imóvel não encontrado.')
    }

    return imovel
  }
}

export { SearchImovelService }
