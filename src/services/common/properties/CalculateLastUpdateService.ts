import { prismaClient } from '../../../database/prismaClient'

class CalculateLastUpdateService {
  async execute(propertyId: string): Promise<Date | null> {
    // Busca os links da propriedade
    const property = await prismaClient.properties.findUnique({
      where: { id: propertyId },
      select: { links: true },
    })

    if (!property || !property.links.length) {
      return null
    }

    // Filtra os `updated_at` não nulos e encontra o mais recente
    const updatedLinks = property.links
      .map((link) => link.updated_at)
      .filter((date): date is Date => date !== null)

    if (updatedLinks.length > 0) {
      return new Date(Math.max(...updatedLinks.map((date) => date.getTime())))
    }

    // Se todos os `updated_at` forem `null`, pega o timestamp mais recente
    return new Date(
      Math.max(...property.links.map((link) => link.timestamp.getTime())),
    )
  }
}

export { CalculateLastUpdateService }
