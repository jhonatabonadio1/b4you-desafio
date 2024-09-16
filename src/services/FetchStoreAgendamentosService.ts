import { prismaClient } from '../database/prismaClient'

type IData = {
  storeId: string
}

class FetchStoreAgendamentosService {
  async execute({ storeId }: IData) {
    const findUser = await prismaClient.prestador.findFirst({
      where: { id: storeId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Prestador não encontrado')
    }

    const findAgendamnetos = await prismaClient.agendamento.findMany({
      where: { prestador: { id: findUser.id }, ativo: true, deleted: false },
      include: {
        usuario: true,
        servico: true,
        veiculo: true,
      },
    })

    const agendamentosNaoValidados = []

    for (const agendamento of findAgendamnetos) {
      const jaValidado = await prismaClient.validacaoAgendamento.findFirst({
        where: { agendamentoId: agendamento.id },
      })

      if (!jaValidado) {
        agendamentosNaoValidados.push(agendamento)
      }
    }

    return agendamentosNaoValidados
  }
}

export { FetchStoreAgendamentosService }
