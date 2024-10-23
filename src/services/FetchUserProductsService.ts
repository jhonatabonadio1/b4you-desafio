import { prismaClient } from '../database/prismaClient'

class FetchUserProductsService {
  async execute() {
    const findProducts = await prismaClient.servico.findMany({
      where: { ativo: true, deleted: false },
      include: {
        opcoesAdicionais: {
          where: {
            deleted: false,
          },
        },
      },
    })

    return findProducts
  }
}

export { FetchUserProductsService }
