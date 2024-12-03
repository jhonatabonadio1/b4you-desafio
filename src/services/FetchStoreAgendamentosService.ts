import { prismaClient } from '../database/prismaClient'

type IData = {
  storeId: string
}

class FetchStoreAgendamentosService {
  async execute({ storeId }: IData) {
    // Busca o prestador pelo ID
    const findUser = await prismaClient.prestador.findFirst({
      where: { id: storeId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Prestador não encontrado')
    }

    // Busca os agendamentos do prestador
    const findAgendamentos = await prismaClient.agendamento.findMany({
      where: { prestador: { id: findUser.id }, ativo: true, deleted: false },
      include: {
        usuario: true,
        servico: true,
        veiculo: true,
      },
    })

    const agendamentosNaoValidados = []

    for (const agendamento of findAgendamentos) {
      // Verifica se o agendamento já foi validado
      const jaValidado = await prismaClient.validacaoAgendamento.findFirst({
        where: { agendamentoId: agendamento.id },
      })

      if (!jaValidado) {
        // Faz o parse de opcoesAdicionais se estiver presente
        const parsedOpcoesAdicionais = agendamento.opcoesAdicionais
          ? (() => {
              try {
                return JSON.parse(agendamento.opcoesAdicionais)
              } catch (error) {
                console.error(
                  `Erro ao fazer o parse de opcoesAdicionais do agendamento ${agendamento.id}:`,
                  error,
                )
                return null // Retorna null se o parse falhar
              }
            })()
          : null

        agendamentosNaoValidados.push({
          ...agendamento,
          opcoesAdicionais: parsedOpcoesAdicionais,
        })
      }
    }

    return agendamentosNaoValidados
  }
}

export { FetchStoreAgendamentosService }
