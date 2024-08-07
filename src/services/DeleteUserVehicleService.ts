import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  vehicleId: string
  userId: string
}

class DeleteUserVehicleService {
  async execute({ vehicleId, userId }: IVehicle) {
    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Usuário não encontrado.')
    }

    const vehicle = await prismaClient.veiculo.findUnique({
      where: { id: vehicleId, deleted: false },
    })

    if (!vehicle) {
      throw new Error('Veículo não encontrado.')
    }

    if (vehicle.usuarioId !== findUser.id) {
      throw new Error('Usuário sem permissão.')
    }

    const updateVeiculoService = await prismaClient.veiculo.update({
      where: { id: vehicle.id, deleted: false },
      data: {
        deleted: true,
      },
    })

    return updateVeiculoService
  }
}

export { DeleteUserVehicleService }
