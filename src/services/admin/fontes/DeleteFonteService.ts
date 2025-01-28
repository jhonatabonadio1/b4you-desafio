import { prismaClient } from '../../../database/prismaClient'

class DeleteFonteService {
  async execute(id: string) {
    if (!id) {
      throw new Error('O ID da fonte é obrigatório.')
    }

    const fonte = await prismaClient.fontes.findUnique({
      where: { id },
    })

    if (!fonte) {
      throw new Error('Fonte não encontrada.')
    }

    await prismaClient.fontes.delete({
      where: { id },
    })

    return { message: 'Fonte deletada com sucesso.' }
  }
}

export { DeleteFonteService }
