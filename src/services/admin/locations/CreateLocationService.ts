import { prismaClient } from '../../../database/prismaClient'

class CreateLocationService {
  async execute(sigla: string, cidade: string) {
    if (!sigla || !cidade) {
      throw new Error('A sigla e a cidade são obrigatórias.')
    }

    const location = await prismaClient.locations.findFirst({
      where: { sigla },
    })

    if (location) {
      // Adiciona uma nova cidade à lista de cidades
      await prismaClient.locations.update({
        where: { id: location.id },
        data: {
          cidades: {
            push: cidade,
          },
        },
      })

      return { message: 'Cidade adicionada à localização existente.' }
    } else {
      // Cria uma nova localização
      const newLocation = await prismaClient.locations.create({
        data: {
          sigla,
          cidades: [cidade],
        },
      })

      return newLocation
    }
  }
}

export { CreateLocationService }
