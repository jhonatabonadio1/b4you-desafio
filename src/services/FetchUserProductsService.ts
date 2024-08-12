import { prismaClient } from '../database/prismaClient'

class FetchUserProductsService {
  async execute() {
    const findProducts = await prismaClient.servico.findMany({
      where: { ativo: true, deleted: false },
      include: {
        opcoesAdicionais: true,
      },
    })

    return findProducts
  }
}

export { FetchUserProductsService }
