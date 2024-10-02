import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchAdminValidacoesBrindesService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = {}
    const searchWhere = search
      ? {
          AND: [
            {
              OR: [
                {
                  prestador: {
                    OR: [
                      {
                        razaoSocial: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                      {
                        inscricao: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    ],
                  },
                },
                {
                  usuario: {
                    OR: [
                      {
                        nome: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                      {
                        cpf: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    ],
                  },
                },
                {
                  brinde: {
                    OR: [
                      {
                        nome: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }
      : baseWhere

    const totalValidacoesBrindes = await prismaClient.validacaoBrinde.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalValidacoesBrindes / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const validacoesBrindes = await prismaClient.validacaoBrinde.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,

        prestador: {
          select: {
            razaoSocial: true,
            inscricao: true,
          },
        },
        usuario: {
          select: {
            nome: true,
            cpf: true,
          },
        },
        brinde: {
          select: {
            nome: true,
          },
        },
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return {
      validacoesBrindes,
      currentPage: page,
      totalPages,
      totalValidacoesBrindes,
    }
  }
}

export { FetchAdminValidacoesBrindesService }
