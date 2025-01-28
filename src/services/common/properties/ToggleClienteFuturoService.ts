import { prismaClient } from '../../../database/prismaClient'

class ToggleClienteFuturoService {
  async execute(id: string) {
    if (!id) {
      throw new Error('O ID da propriedade é obrigatório.')
    }

    // Busca a propriedade pelo ID
    const property = await prismaClient.properties.findUnique({
      where: {
        id,
      },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada.')
    }

    // Atualiza o campo `clienteFuturo` para o oposto do valor atual
    const updatedProperty = await prismaClient.properties.update({
      where: {
        id,
      },
      data: {
        clienteFuturo: !property.clienteFuturo,
      },
    })

    return updatedProperty.clienteFuturo
  }
}

export { ToggleClienteFuturoService }
