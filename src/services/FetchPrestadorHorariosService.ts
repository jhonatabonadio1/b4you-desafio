import { prismaClient } from '../database/prismaClient'

interface IRequest {
  prestadorId: string
}

class FetchPrestadorHorariosService {
  async execute({ prestadorId }: IRequest) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    return {
      horarios: user.datasDisponiveis,
    }
  }
}

export { FetchPrestadorHorariosService }
