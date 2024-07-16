import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchConveniosService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = { deleted: false }
    const searchWhere = search
      ? {
          AND: [
            { deleted: false },
            {
              OR: [
                {
                  titulo: { contains: search, mode: 'insensitive' as const },
                },
                { texto: { contains: search, mode: 'insensitive' as const } },
              ],
            },
          ],
        }
      : baseWhere

    const totalConvenios = await prismaClient.convenios.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalConvenios / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const convenios = await prismaClient.convenios.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    })

    return {
      convenios,
      currentPage: page,
      totalPages,
      totalConvenios,
    }
  }
}

export { FetchConveniosService }
