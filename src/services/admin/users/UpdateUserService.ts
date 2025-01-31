import { prismaClient } from '../../../database/prismaClient'
import bcrypt from 'bcryptjs'

class UpdateUserService {
  async execute(
    id: string,
    updates: {
      email?: string
      nome?: string
      role?: string
      password?: string
    },
  ) {
    if (!id) {
      throw new Error('ID é obrigatório.')
    }

    const user = await prismaClient.users.findFirst({
      where: { id, deleted: false },
    })

    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    const updatedData: any = {}
    if (updates.email) updatedData.email = updates.email
    if (updates.nome) updatedData.nome = updates.nome
    if (updates.role) updatedData.role = updates.role
    if (updates.password) {
      const salt = bcrypt.genSaltSync(10)
      updatedData.password = bcrypt.hashSync(updates.password, salt)
    }

    const updatedUser = await prismaClient.users.update({
      where: { id },
      data: updatedData,
    })

    return updatedUser
  }
}

export { UpdateUserService }
