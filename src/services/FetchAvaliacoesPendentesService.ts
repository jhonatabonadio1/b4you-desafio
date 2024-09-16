import { prismaClient } from '../database/prismaClient'

interface IUser {
  userId: string
}

class FetchAvaliacoesPendentesService {
  async execute({ userId }: IUser) {
    const avaliacoes = await prismaClient.validacaoAgendamento.findMany({
      where: {
        usuario: {
          id: userId,
        },
        OR: [
          { avaliado: null },
          { avaliado: false },
          { avaliado: { equals: undefined } },
        ],
      },
      include: {
        prestador: {
          select: {
            razaoSocial: true,
          },
        },
      },
    })

    const arrayFormatted = []

    for (const validacao of avaliacoes) {
      const avaliacao = {
        id: validacao.id,
        storeName: validacao.prestador.razaoSocial,
        pendente: !validacao.avaliado,
        data_utilizacao: validacao.created_at,
      }

      arrayFormatted.push(avaliacao)
    }

    return arrayFormatted
  }
}

export { FetchAvaliacoesPendentesService }
