import { prismaClient } from '../database/prismaClient'

interface IUser {
  id: string
}

class FetchInformativoService {
  async execute({ id }: IUser) {
    const informativo = await prismaClient.informativos.findFirst({
      where: {
        id,
      },
    })

    if (!informativo) {
      throw new Error('Informativo não encontrado')
    }

    return informativo
  }
}

export { FetchInformativoService }
