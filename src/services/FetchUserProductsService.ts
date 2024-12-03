import { prismaClient } from '../database/prismaClient'

class FetchUserProductsService {
  async execute() {
    const findProducts = await prismaClient.servico.findMany({
      where: { ativo: true, deleted: false },
    })

    // Parse do campo opcoesAdicionais para JSON
    const productsWithParsedOptions = findProducts.map((product) => {
      return {
        ...product,
        opcoesAdicionais: product.opcoesAdicionais
          ? JSON.parse(product.opcoesAdicionais)
          : null, // Verifica se o campo opcoesAdicionais existe antes de tentar fazer o parse
      }
    })

    return productsWithParsedOptions
  }
}

export { FetchUserProductsService }
