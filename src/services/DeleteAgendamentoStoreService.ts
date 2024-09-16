import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  usuarioId: string
}

class DeleteAgendamentoStoreService {
  async execute({ id, usuarioId }: IRequest) {
    // Encontrar o agendamento
    const agendamento = await prismaClient.agendamento.findFirst({
      where: {
        id,
        prestador: { id: usuarioId },
        deleted: false,
      },
    })

    if (!agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário.')
    }

    // Verificar se o agendamento foi validado
    const validacao = await prismaClient.validacaoAgendamento.findFirst({
      where: {
        agendamentoId: id,
      },
    })

    // Se o agendamento foi validado, não pode ser cancelado
    if (validacao) {
      throw new Error(
        'Este agendamento já foi validado e não pode ser cancelado.',
      )
    }

    const deleteAgendamento = await prismaClient.agendamento.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        ativo: false,
      },
    })

    return deleteAgendamento
  }
}

export { DeleteAgendamentoStoreService }
