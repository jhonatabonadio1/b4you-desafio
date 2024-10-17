import { prismaClient } from '../database/prismaClient'

type IData = {
  userId: string
}

class FetchUserAgendamentosService {
  async execute({ userId }: IData) {
    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Usuário não encontrado')
    }

    const findAgendamnetos = await prismaClient.agendamento.findMany({
      where: {
        usuario: { id: findUser.id },
        ativo: true,
        deleted: false,
      },
      include: {
        prestador: true,
        servico: true,
        veiculo: true,
      },
    })

    const agendamentosNaoValidados = []

    for (const agendamento of findAgendamnetos) {
      const verificaAgendamentoJaValidado =
        await prismaClient.validacaoAgendamento.findFirst({
          where: { agendamentoId: agendamento.id },
        })

      if (!verificaAgendamentoJaValidado) {
        // Buscar as opções adicionais
        const opcoesAdicionais = await Promise.all(
          agendamento.opcoesAdicionais.map(async (opcaoId) =>
            prismaClient.opcaoAdicional.findFirst({
              where: { id: opcaoId },
            }),
          ),
        )

        // Filtrar as opções adicionais removendo qualquer valor null
        const filteredOpcoesAdicionais = opcoesAdicionais.filter(
          (opcao) => opcao !== null,
        )

        // Adicionar o agendamento ao array com as opções adicionais resolvidas
        agendamentosNaoValidados.push({
          ...agendamento,
          opcoesAdicionais: filteredOpcoesAdicionais,
        })
      }
    }

    return agendamentosNaoValidados
  }
}

export { FetchUserAgendamentosService }
