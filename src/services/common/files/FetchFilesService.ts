import { prismaClient } from '../../../database/prismaClient'
import { Prisma } from '@prisma/client' // Importa tipos do Prisma

class FetchFilesService {
  async execute(userId: string, search?: string) {
    try {
      // Define o filtro para busca
      const query = search
        ? {
            title: {
              contains: search, // Busca case-insensitive
              mode: Prisma.QueryMode.insensitive, // Utiliza o tipo QueryMode do Prisma
            },
          }
        : {}

      // Busca usuários no banco de dados com ordenação por nome

      const files = await prismaClient.document.findMany({
        where: { ...query, userId },
        orderBy: {
          updatedAt: 'desc', // Ordena pelo nome em ordem crescente
        },
      })

      return files
    } catch (error) {
      throw new Error('Falha ao listar documentos.')
    }
  }
}

export { FetchFilesService }
