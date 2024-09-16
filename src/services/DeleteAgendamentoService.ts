import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteAgendamentoService {
  async execute({ id }: IRequest) {
    const agendamento = await prismaClient.agendamento.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!agendamento) {
      throw new Error('Agendamento não encontrado')
    }

    const deleteAgendamento = await prismaClient.agendamento.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
        ativo: false,
      },
    })

    return deleteAgendamento
  }
}

export { DeleteAgendamentoService }
