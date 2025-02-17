import { hash } from 'bcryptjs'
import { prismaClient } from '../../../database/prismaClient'
import { stripe } from '../../../lib/stripe'

interface ICreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  empresa: string
}

class CreateUserService {
  async execute({
    email,
    password,
    firstName,
    lastName,
    empresa,
  }: ICreateUserRequest) {
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Preencha os campos obrigatórios.')
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      throw new Error('Usuário já existe.')
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
    })

    // Criação do usuário no banco de dados
    await prismaClient.user.create({
      data: {
        email,
        firstName,
        lastName,
        empresa,
        password: hashedPassword,
        stripeCustomerId: customer.id,
      },
    })

    // Retorno de sucesso
    return { message: 'Sua conta foi criada, faça o login.' }
  }
}

export { CreateUserService }
