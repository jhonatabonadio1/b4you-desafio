import { prismaClient } from '../../../database/prismaClient'

class DeletePropertyService {
  async execute(propertyId: string, userId: string) {
    if (!propertyId) {
      throw new Error('O ID da propriedade é obrigatório.')
    }

    // Busca o usuário pelo ID
    const user = await prismaClient.users.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    // Busca a propriedade pelo ID
    const property = await prismaClient.properties.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada.')
    }

    // Verifica se o usuário tem permissão para excluir
    if (user.role !== 'admin' && property.user !== userId) {
      throw new Error('Você não tem permissão para excluir esta propriedade.')
    }

    // Exclui a propriedade do banco de dados
    await prismaClient.properties.delete({
      where: { id: propertyId },
    })

    return { message: 'Propriedade excluída com sucesso.' }
  }
}

export { DeletePropertyService }
