import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchAdminValidacoesService {
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
                  agendamento: {
                    OR: [
                      {
                        servico: {
                          nome: {
                            contains: search,
                            mode: 'insensitive' as const,
                          },
                        },
                      },
                      {
                        veiculo: {
                          placa: {
                            contains: search,
                            mode: 'insensitive' as const,
                          },
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

    const totalValidacoes = await prismaClient.validacaoAgendamento.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalValidacoes / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const validacoes = await prismaClient.validacaoAgendamento.findMany({
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
        agendamento: {
          include: {
            servico: {
              select: {
                nome: true,
              },
            },
            veiculo: true,
          },
        },
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return {
      validacoes,
      currentPage: page,
      totalPages,
      totalValidacoes,
    }
  }
}

export { FetchAdminValidacoesService }
