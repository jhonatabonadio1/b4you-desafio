import { prismaClient } from '../../../database/prismaClient'
import { CalculateLastUpdateService } from './CalculateLastUpdateService'

class ListAllPropertiesService {
  async execute() {
    const properties = await prismaClient.properties.findMany({})
    const calculateLastUpdateService = new CalculateLastUpdateService()

    const data = await Promise.all(
      properties.map(async (property) => {
        const user = await prismaClient.users.findFirst({
          where: { id: property.user },
        })

        const lastUpdate = await calculateLastUpdateService.execute(property.id)

        return {
          ...property,
          userName: user?.nome || 'Usuário Desconhecido',
          lastLinkUpdate: lastUpdate, // Adiciona a data do último link atualizado
        }
      }),
    )

    return data
  }
}

export { ListAllPropertiesService }
