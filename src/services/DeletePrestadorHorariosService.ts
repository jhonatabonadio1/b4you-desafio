import { prismaClient } from '../database/prismaClient'

interface IRequest {
  prestadorId: string
  data: string
}

class DeletePrestadorHorariosService {
  async execute({ prestadorId, data }: IRequest) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const datas = user.datasDisponiveis

    const findData = datas.find((item) => item === data)

    if (!findData) {
      throw new Error('Data não encontrada')
    }

    const removeData = datas.filter((item) => item !== data)

    const updateData = await prismaClient.prestador.update({
      where: { id: user.id, deleted: false },
      data: {
        datasDisponiveis: removeData,
      },
    })

    return updateData
  }
}

export { DeletePrestadorHorariosService }
