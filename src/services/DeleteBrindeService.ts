import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteBrindeService {
  async execute({ id }: IRequest) {
    const brinde = await prismaClient.brinde.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!brinde) {
      throw new Error('Brinde não encontrado')
    }

    const deleteBrinde = await prismaClient.brinde.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    })

    return deleteBrinde
  }
}

export { DeleteBrindeService }
