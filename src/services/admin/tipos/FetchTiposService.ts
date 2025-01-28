import { prismaClient } from '../../../database/prismaClient'

class FetchTiposService {
  async execute() {
    const tipos = await prismaClient.tipos.findMany()

    if (!tipos || tipos.length === 0) {
      throw new Error('Nenhum tipo encontrado.')
    }

    return tipos
  }
}

export { FetchTiposService }
