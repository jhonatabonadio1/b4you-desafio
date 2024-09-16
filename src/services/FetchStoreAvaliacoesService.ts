import { prismaClient } from '../database/prismaClient'

type IData = {
  storeId: string
}

class FetchStoreAvaliacoesService {
  async execute({ storeId }: IData) {
    const findUser = await prismaClient.prestador.findFirst({
      where: { id: storeId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Prestador não encontrado')
    }

    const findAvaliacoes = await prismaClient.validacaoAgendamento.findMany({
      where: { prestador: { id: findUser.id }, avaliado: true },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        servicoCompleto: true,
        bomAtendimento: true,
        estrelas: true,
        message: true,
        dataAvaliacao: true,
      },
    })

    return findAvaliacoes
  }
}

export { FetchStoreAvaliacoesService }
