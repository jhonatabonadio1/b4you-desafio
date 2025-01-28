import { prismaClient } from '../../../database/prismaClient'

class FetchFontesService {
  async execute() {
    const fontes = await prismaClient.fontes.findMany()

    if (!fontes || fontes.length === 0) {
      throw new Error('Nenhuma fonte encontrada.')
    }

    return fontes
  }
}

export { FetchFontesService }
