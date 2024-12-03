import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchAdminAvaliacoesService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = { avaliado: true, deletedAvaliacao: false || undefined }
    const searchWhere = search
      ? {
          AND: [
            { avaliado: true },
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
              ],
            },
          ],
        }
      : baseWhere

    const totalAvaliacoes = await prismaClient.validacaoAgendamento.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalAvaliacoes / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const avaliacoes = await prismaClient.validacaoAgendamento.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        avaliado: true,
        message: true,
        estrelas: true,
        dataAvaliacao: true,
        servicoCompleto: true,
        bomAtendimento: true,
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
      },

      orderBy: { dataAvaliacao: 'desc' },
    })

    return {
      avaliacoes,
      currentPage: page,
      totalPages,
      totalAvaliacoes,
    }
  }
}

export { FetchAdminAvaliacoesService }
