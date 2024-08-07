import { prismaClient } from '../database/prismaClient'

interface IRequest {
  vehicleId: string
  nome?: string
  placa?: string
  categoria?: string
  userId: string
}

class UpdateUserVehicleService {
  async execute({ vehicleId, nome, placa, categoria, userId }: IRequest) {
    if (!vehicleId) {
      throw new Error('ID do veículo é obrigatório')
    }

    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Usuário não encontrado.')
    }

    const findVehicle = await prismaClient.veiculo.findFirst({
      where: { id: vehicleId, deleted: false },
    })

    if (!findVehicle) {
      throw new Error('Veículo não encontrado.')
    }

    if (findVehicle.usuarioId !== findUser.id) {
      throw new Error('Usuário sem permissão.')
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

export { UpdateUserVehicleService }
