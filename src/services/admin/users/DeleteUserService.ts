import { prismaClient } from '../../../database/prismaClient'

class DeleteUserService {
  async execute(id: string) {
    if (!id) {
      throw new Error('ID é obrigatório.')
    }

    const user = await prismaClient.users.findFirst({
      where: { id, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    await prismaClient.users.update({
      where: { id },
      data: {
        deleted: true,
      },
    })

    return { message: 'Usuário deletado com sucesso.' }
  }
}

export { DeleteUserService }
