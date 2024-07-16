import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteInformativoService {
  async execute({ id }: IRequest) {
    const informativo = await prismaClient.informativos.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!informativo) {
      throw new Error('Informativo não encontrado')
    }

    const deleteInformativo = await prismaClient.informativos.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    })

    return deleteInformativo
  }
}

export { DeleteInformativoService }
