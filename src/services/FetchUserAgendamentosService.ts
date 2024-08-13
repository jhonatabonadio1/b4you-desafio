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
      where: { usuario: { id: findUser.id }, ativo: true, deleted: false },
      include: {
        prestador: true,
        servico: true,
        veiculo: true,
        opcaoAdicional: true,
      },
    })

    return findAgendamnetos
  }
}

export { FetchUserAgendamentosService }
