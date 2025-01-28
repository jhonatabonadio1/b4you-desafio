import { prismaClient } from '../../../database/prismaClient'

class ListAllImoveisService {
  async execute() {
    try {
      // Busca todos os imóveis no banco de dados
      const properties = await prismaClient.imovels.findMany()

      // Mapeia os imóveis para buscar o nome do usuário associado
      const data = await Promise.all(
        properties.map(async (property) => {
          // Busca o usuário pelo ID armazenado no campo `user`
          const user = await prismaClient.users.findUnique({
            where: {
              id: property.user, // `user` é uma string com o ID
            },
          })

          return {
            ...property,
            userName: user?.nome || null, // Adiciona o nome do usuário, ou `null` se não encontrado
          }
        }),
      )

      return data
    } catch (error) {
      throw new Error('Falha ao buscar os imóveis.')
    }
  }
}

export { ListAllImoveisService }
