import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteAvaliacaoAdminService {
  async execute({ id }: IRequest) {
    const validacao = await prismaClient.validacaoAgendamento.findFirst({
      where: {
        id,
      },
    })

    if (!validacao) {
      throw new Error('Validação não encontrada')
    }

    const deleteAvaliacao = await prismaClient.validacaoAgendamento.update({
      where: {
        id,
      },
      data: {
        deletedAvaliacao: true,
      },
    })

    return deleteAvaliacao
  }
}

export { DeleteAvaliacaoAdminService }
