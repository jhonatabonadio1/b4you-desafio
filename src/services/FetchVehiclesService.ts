import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  page: number
  search?: string
}

class FetchVehiclesService {
  async execute({ page, search }: IVehicle, pageSize = 10) {
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
                {
                  usuario: {
                    cpf: { contains: search, mode: 'insensitive' as const },
                  },
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
      include: {
        usuario: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    })

    const veiculosFormatados = []

    for (const veiculo of veiculos) {
      veiculosFormatados.push({
        id: veiculo.id,
        nome: veiculo.nome,
        cpf: veiculo.usuario.cpf,
        placa: veiculo.placa,
        modelo: veiculo.modelo,
        marca: veiculo.marca,
        categoria: veiculo.categoria,
        created_at: veiculo.created_at,
      })
    }

    return {
      veiculos: veiculosFormatados,
      currentPage: page,
      totalPages,
      totalUsers,
    }
  }
}

export { FetchVehiclesService }
