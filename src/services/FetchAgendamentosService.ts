import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

class FetchAgendamentosService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = { deleted: false }
    const searchWhere = search
      ? {
          AND: [
            { deleted: false },
            {
              OR: [
                {
                  servico: {
                    nome: { contains: search, mode: 'insensitive' as const },
                  },
                },
                {
                  usuario: {
                    cpf: { contains: search, mode: 'insensitive' as const },
                    nome: { contains: search, mode: 'insensitive' as const },
                  },
                },
                {
                  veiculo: {
                    placa: { contains: search, mode: 'insensitive' as const },
                  },
                },
                {
                  prestador: {
                    razaoSocial: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                    inscricao: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              ],
            },
          ],
        }
      : baseWhere

    const totalAgendamentos = await prismaClient.agendamento.count({
      where: searchWhere,
    })

    const totalPages = Math.max(Math.ceil(totalAgendamentos / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const agendamentos = await prismaClient.agendamento.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        ativo: true,
        semValidade: true,
        veiculo: {
          select: {
            placa: true,
            modelo: true,
            marca: true,
            categoria: true,
          },
        },
        prestador: {
          select: {
            razaoSocial: true,
            inscricao: true,
          },
        },
        servico: {
          select: {
            nome: true,
          },
        },
        usuario: {
          select: {
            nome: true,
            cpf: true,
          },
        },
        data: true,
        opcoesAdicionais: true,
        created_at: true,
      },

      orderBy: { created_at: 'desc' },
    })

    return {
      agendamentos,
      currentPage: page,
      totalPages,
      totalAgendamentos,
    }
  }
}

export { FetchAgendamentosService }
