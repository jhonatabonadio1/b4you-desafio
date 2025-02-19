import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prismaClient } from '../../../database/prismaClient'

interface ISignInRequest {
  email: string
  password: string
}

class SignInService {
  async execute({ email, password }: ISignInRequest) {
    const { sign } = jwt

    if (!email) {
      throw new Error('E-mail é obrigatório.')
    }

    if (!password) {
      throw new Error('Senha é obrigatória.')
    }

    // Busca o usuário no banco de dados
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('E-mail/Senha incorretos.')
    }

    // Compara a senha informada com a senha armazenada
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('E-mail/Senha incorretos.')
    }

    // Geração do token JWT
    const token = sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '7d',
      },
    )

    return {
      token,
      user,
    }
  }
}

export { SignInService }
