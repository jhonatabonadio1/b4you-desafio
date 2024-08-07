import { prismaClient } from '../database/prismaClient'

interface IRequest {
  nome: string
  placa: string
  categoria: string
  userId: string
}

class CreateVehicleService {
  async execute({ nome, placa, categoria, userId }: IRequest) {
    if (!placa) {
      throw new Error('Placa inválida.')
    }

    if (!nome) {
      throw new Error('Nome é obrigatório')
    }

    if (!categoria) {
      throw new Error('Categoria é obrigatória')
    }

    const findUser = await prismaClient.usuario.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Usuário não encontrado.')
    }

    const veiculoAlreadyExists = await prismaClient.veiculo.findFirst({
      where: {
        placa,
        deleted: false,
      },
    })

    const veiculoUsuarioAlreadyExists = await prismaClient.veiculo.findFirst({
      where: {
        placa,
        usuario: {
          cpf: findUser.cpf,
          deleted: false,
        },
        deleted: false,
      },
    })

    if (veiculoAlreadyExists) {
      throw new Error('Veículo já cadastrado')
    }

    if (veiculoUsuarioAlreadyExists) {
      throw new Error('Veículo já cadastrado para o usuário')
    }

    const veiculo = await prismaClient.veiculo.create({
      data: {
        nome,
        placa,
        categoria,
        usuario: {
          connect: {
            id: findUser.id,
          },
        },
      },
    })

    return veiculo
  }
}

export { CreateVehicleService }
