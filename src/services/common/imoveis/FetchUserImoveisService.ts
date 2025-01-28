import { prismaClient } from '../../../database/prismaClient'

class FetchUserImoveisService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    // Busca todos os imóveis associados ao usuário
    const properties = await prismaClient.imovels.findMany({
      where: {
        user: userId,
        deleted: false, // Garante que não retorne imóveis deletados
      },
    })

    if (!properties || properties.length === 0) {
      throw new Error('Nenhum imóvel encontrado para este usuário.')
    }

    return properties
  }
}

export { FetchUserImoveisService }
