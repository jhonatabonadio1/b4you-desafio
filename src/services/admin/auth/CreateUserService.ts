import { hash } from 'bcryptjs'
import { prismaClient } from '../../../database/prismaClient'

interface ICreateUserRequest {
  email: string
  password: string
  nome: string
  role: string
  token: string | undefined
}

class CreateUserService {
  async execute({ email, password, nome, role, token }: ICreateUserRequest) {
    // Verifica se o token foi fornecido
    if (!token) {
      throw new Error('Token não fornecido.')
    }

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!email || !password || !nome || !role) {
      throw new Error('Todos os campos são obrigatórios.')
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await prismaClient.users.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      throw new Error('Usuário já existe.')
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Criação do usuário no banco de dados
    await prismaClient.users.create({
      data: {
        email,
        nome,
        v: 0,
        password: hashedPassword,
        role: role || 'user',
      },
    })

    // Retorno de sucesso
    return { message: 'Usuário criado com sucesso.' }
  }
}

export { CreateUserService }
