import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchBrindesService {
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

    const totalBrindes = await prismaClient.brinde.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalBrindes / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const brindes = await prismaClient.brinde.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    })

    return {
      brindes,
      currentPage: page,
      totalPages,
      totalBrindes,
    }
  }
}

export { FetchBrindesService }
