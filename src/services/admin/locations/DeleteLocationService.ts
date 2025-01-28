import { prismaClient } from '../../../database/prismaClient'

class DeleteLocationService {
  async execute(sigla: string, cidade: string) {
    if (!sigla || !cidade) {
      throw new Error('A sigla e a cidade são obrigatórias.')
    }

    const location = await prismaClient.locations.findFirst({
      where: { sigla },
    })

    if (!location) {
      throw new Error('Localização não encontrada.')
    }

    // Remove a cidade da lista
    const updatedCidades = location.cidades.filter((c) => c !== cidade)

    await prismaClient.locations.update({
      where: { id: location.id },
      data: {
        cidades: updatedCidades,
      },
    })

    return { message: 'Cidade removida com sucesso.' }
  }
}

export { DeleteLocationService }
