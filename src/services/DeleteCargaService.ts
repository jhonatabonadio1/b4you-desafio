import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteCargaService {
  async execute({ id }: IRequest) {
    const deleteCarga = await prismaClient.carga.delete({
      where: { id, deleted: false },
    })

    return deleteCarga
  }
}

export { DeleteCargaService }
