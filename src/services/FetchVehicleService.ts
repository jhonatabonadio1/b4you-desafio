import { prismaClient } from '../database/prismaClient'

interface IVeiculo {
  vehicleId: string
}

class FetchVehicleService {
  async execute({ vehicleId }: IVeiculo) {
    const veiculo = await prismaClient.veiculo.findUnique({
      where: { id: vehicleId, deleted: false },
    })

    if (!veiculo) {
      throw new Error('Veículo não encontrado')
    } else {
      const findUser = await prismaClient.usuario.findFirst({
        where: {
          id: veiculo.usuarioId,
          deleted: false,
        },
      })

      if (!findUser) {
        throw new Error('Usuário vinculado ao veículo não encontrado.')
      }
      const vehicleData = {
        id: veiculo.id,
        nome: veiculo.nome,
        placa: veiculo.placa,
        cpf: findUser.cpf,
        categoria: veiculo.categoria,
      }
      return vehicleData
    }
  }
}

export { FetchVehicleService }
