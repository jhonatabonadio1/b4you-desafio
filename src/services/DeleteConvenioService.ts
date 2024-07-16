import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class DeleteConvenioService {
  async execute({ id }: IRequest) {
    const convenio = await prismaClient.convenios.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!convenio) {
      throw new Error('Convênio não encontrado')
    }

    const deleteConvenio = await prismaClient.convenios.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    })

    return deleteConvenio
  }
}

export { DeleteConvenioService }
