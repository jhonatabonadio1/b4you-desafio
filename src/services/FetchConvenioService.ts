import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
}

class FetchConvenioService {
  async execute({ id }: IRequest) {
    if (!id) {
      throw new Error('ID do convênio é obrigatório')
    }

    const existingConvenio = await prismaClient.convenios.findUnique({
      where: { id, deleted: false },
    })

    if (!existingConvenio) {
      throw new Error('Convênio não encontrado')
    }

    return existingConvenio
  }
}

export { FetchConvenioService }
