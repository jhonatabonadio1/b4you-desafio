import { prismaClient } from '../../../database/prismaClient'

class SearchPropertyService {
  async execute(clientCode: string) {
    if (!clientCode) {
      throw new Error('O código do cliente é obrigatório.')
    }

    // Busca a propriedade pelo código do cliente
    const property = await prismaClient.properties.findFirst({
      where: {
        clientCode,
      },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada.')
    }

    return property
  }
}

export { SearchPropertyService }
