import { hash } from 'bcryptjs'
import { prismaClient } from '../../../database/prismaClient'

interface IUpdateUserRequest {
  userId: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  empresa?: string
}

class UpdateUserService {
  async execute({
    userId,
    email,
    password,
    firstName,
    lastName,
    empresa,
  }: IUpdateUserRequest) {
    // Verifica se o ID do usuário foi fornecido
    if (!userId) {
      throw new Error('ID do usuário é obrigatório.')
    }

    // Verifica se o usuário existe
    const existingUser = await prismaClient.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      throw new Error('Usuário não encontrado.')
    }

    // Prepara os dados para atualização
    const data: any = {}
    if (email) data.email = email
    if (firstName) data.firstName = firstName
    if (lastName) data.lastName = lastName
    if (empresa) data.empresa = empresa

    // Hash da nova senha, se fornecida
    if (password) {
      data.password = await hash(password, 12)
    }

    // Atualiza o usuário no banco de dados
    const user = await prismaClient.user.update({
      where: { id: userId },
      data,
    })

    return user
  }
}

export { UpdateUserService }
