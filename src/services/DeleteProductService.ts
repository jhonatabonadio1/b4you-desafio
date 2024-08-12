import { prismaClient } from '../database/prismaClient'

interface IProduct {
  produtoId: string
}

class DeleteProductService {
  async execute({ produtoId }: IProduct) {
    const produto = await prismaClient.servico.findUnique({
      where: { id: produtoId, deleted: false },
    })

    if (!produto) {
      throw new Error('Produto não encontrado.')
    }

    const updateUserService = await prismaClient.servico.update({
      where: { id: produto.id, deleted: false },
      data: {
        deleted: true,
      },
    })

    return updateUserService
  }
}

export { DeleteProductService }
