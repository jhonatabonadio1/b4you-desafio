import { prismaClient } from '../../../database/prismaClient'

class DeleteTipoService {
  async execute(id: string) {
    if (!id) {
      throw new Error('O ID do tipo é obrigatório.')
    }

    const tipo = await prismaClient.tipos.findUnique({
      where: { id },
    })

    if (!tipo) {
      throw new Error('Tipo não encontrado.')
    }

    await prismaClient.tipos.delete({
      where: { id },
    })

    return { message: 'Tipo deletado com sucesso.' }
  }
}

export { DeleteTipoService }
