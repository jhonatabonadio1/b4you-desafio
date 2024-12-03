import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchProductsService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = { deleted: false }
    const searchWhere = search
      ? {
          AND: [
            { deleted: false },
            {
              OR: [
                {
                  nome: { contains: search, mode: 'insensitive' as const },
                },
              ],
            },
          ],
        }
      : baseWhere

    const totalProdutos = await prismaClient.servico.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalProdutos / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const produtos = await prismaClient.servico.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        nome: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return {
      produtos,
      currentPage: page,
      totalPages,
      totalProdutos,
    }
  }
}

export { FetchProductsService }
