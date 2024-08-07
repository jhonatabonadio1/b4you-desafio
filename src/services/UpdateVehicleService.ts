import { prismaClient } from '../database/prismaClient'

interface IRequest {
  vehicleId: string
  nome?: string
  placa?: string
  categoria?: string
}

class UpdateVehicleService {
  async execute({ vehicleId, nome, placa, categoria }: IRequest) {
    if (!vehicleId) {
      throw new Error('ID do veículo é obrigatório')
    }

    const findVehicle = await prismaClient.veiculo.findFirst({
      where: { id: vehicleId, deleted: false },
    })

    if (!findVehicle) {
      throw new Error('Veículo não encontrado.')
    }

    const veiculoAlreadyExists = await prismaClient.veiculo.findFirst({
      where: {
        id: {
          not: vehicleId,
        },
        placa,
        deleted: false,
      },
    })

    if (veiculoAlreadyExists) {
      throw new Error('Veículo já cadastrado')
    }

    const updatedVeiculo = await prismaClient.veiculo.update({
      where: { id: findVehicle.id, deleted: false },
      data: {
        nome: nome || findVehicle.nome,
        placa: placa || findVehicle.placa,
        categoria: categoria || findVehicle.categoria,
      },
    })

    return updatedVeiculo
  }
}

export { UpdateVehicleService }
