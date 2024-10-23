import { prismaClient } from '../database/prismaClient'

interface IRequest {
  prestadorId: string
  data: string
}

class CreatePrestadorHorariosService {
  async execute({ prestadorId, data }: IRequest) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    for (const dataDisponivel of user.datasDisponiveis) {
      if (dataDisponivel === data) {
        throw new Error('Data e hora já adicionados')
      }
    }

    const datas = user.datasDisponiveis
    datas.push(data)

    const updateData = await prismaClient.prestador.update({
      where: {
        id: user.id,
        deleted: false,
      },
      data: {
        datasDisponiveis: datas,
      },
    })

    return updateData
  }
}

export { CreatePrestadorHorariosService }
