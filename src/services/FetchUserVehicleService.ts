import { prismaClient } from '../database/prismaClient'

interface IVeiculo {
  vehicleId: string
  userId: string
}

class FetchUserVehicleService {
  async execute({ vehicleId, userId }: IVeiculo) {
    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId },
    })
    if (!findUser) {
      throw new Error('Usuário não encontrado.')
    }
    const veiculo = await prismaClient.veiculo.findUnique({
      where: { id: vehicleId, deleted: false },
    })

    if (!veiculo) {
      throw new Error('Veículo não encontrado')
    } else {
      if (veiculo.usuarioId !== findUser.id) {
        throw new Error('Usuário sem permissão.')
      }
      const vehicleData = {
        nome: veiculo.nome,
        placa: veiculo.placa,
        cpf: findUser.cpf,
        categoria: veiculo.categoria,
      }
      return vehicleData
    }
  }
}

export { FetchUserVehicleService }
