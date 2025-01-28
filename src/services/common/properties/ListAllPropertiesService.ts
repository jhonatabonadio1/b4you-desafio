import { prismaClient } from '../../../database/prismaClient'

class ListAllPropertiesService {
  async execute() {
    // Busca todas as propriedades no banco de dados
    const properties = await prismaClient.properties.findMany()

    // Adiciona o nome do usuário relacionado às propriedades
    const data = await Promise.all(
      properties.map(async (property) => {
        const user = await prismaClient.users.findUnique({
          where: { id: property.user },
        })

        return {
          ...property,
          userName: user?.nome || null, // Adiciona o nome do usuário
        }
      }),
    )

    return data
  }
}

export { ListAllPropertiesService }
