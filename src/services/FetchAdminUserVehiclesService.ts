import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  userId: string
}

class FetchAdminUserVehiclesService {
  async execute({ userId }: IVehicle) {
    const findVehicles = await prismaClient.veiculo.findMany({
      where: { usuarioId: userId, deleted: false },
    })
    if (!findVehicles) {
      throw new Error('Veículo não encontrado')
    }

    return findVehicles
  }
}

export { FetchAdminUserVehiclesService }
