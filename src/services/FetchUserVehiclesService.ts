import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  userId: string
}

class FetchUserVehiclesService {
  async execute({ userId }: IVehicle) {
    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId, deleted: false },
    })
    if (!findUser) {
      throw new Error('Usuário não encotnrado.')
    }
    const veiculos = await prismaClient.veiculo.findMany({
      where: { usuario: { id: findUser.id }, deleted: false },
    })

    return veiculos
  }
}

export { FetchUserVehiclesService }
