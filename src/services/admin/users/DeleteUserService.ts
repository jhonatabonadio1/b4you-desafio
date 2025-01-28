import { prismaClient } from '../../../database/prismaClient'

class DeleteUserService {
  async execute(id: string) {
    if (!id) {
      throw new Error('ID é obrigatório.')
    }

    const user = await prismaClient.users.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    await prismaClient.users.delete({
      where: { id },
    })

    return { message: 'Usuário deletado com sucesso.' }
  }
}

export { DeleteUserService }
