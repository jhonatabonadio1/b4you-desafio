import { prismaClient } from '../../../database/prismaClient'
import { Prisma } from '@prisma/client' // Importa tipos do Prisma

class ListAllUsersService {
  async execute(search?: string) {
    try {
      // Define o filtro para busca
      const query = search
        ? {
            nome: {
              contains: search, // Busca case-insensitive
              mode: Prisma.QueryMode.insensitive, // Utiliza o tipo QueryMode do Prisma
            },
          }
        : {}

      // Busca usuários no banco de dados com ordenação por nome

      const users = await prismaClient.users.findMany({
        where: query,
        orderBy: {
          nome: 'asc', // Ordena pelo nome em ordem crescente
        },
      })

      return users
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw new Error('Falha ao listar usuários.')
    }
  }
}

export { ListAllUsersService }
