import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  page: number
  search?: string
}

class FetchVehiclesService {
  async execute({ page, search }: IVehicle, pageSize = 2) {
    const baseWhere = { deleted: false }
    const searchWhere = search
      ? {
          AND: [
            { deleted: false },
            {
              OR: [
                { nome: { contains: search, mode: 'insensitive' as const } },
                { placa: { contains: search, mode: 'insensitive' as const } },
                {
                  categoria: { contains: search, mode: 'insensitive' as const },
                },
              ],
            },
          ],
        }
      : baseWhere

    const totalUsers = await prismaClient.veiculo.count({
      where: searchWhere,
    })
    const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const veiculos = await prismaClient.veiculo.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    })

    return {
      veiculos,
      currentPage: page,
      totalPages,
      totalUsers,
    }
  }
}

export { FetchVehiclesService }
