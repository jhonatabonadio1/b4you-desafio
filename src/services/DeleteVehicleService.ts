import { prismaClient } from '../database/prismaClient'

interface IVehicle {
  vehicleId: string
}

class DeleteVehicleService {
  async execute({ vehicleId }: IVehicle) {
    const vehicle = await prismaClient.veiculo.findUnique({
      where: { id: vehicleId, deleted: false },
    })

    if (!vehicle) {
      throw new Error('Veículo não encontrado.')
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

export { DeleteVehicleService }
