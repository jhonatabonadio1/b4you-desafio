import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prismaClient } from '../database/prismaClient'

interface IAuthenticateRequest {
  email: string
  password: string
}

// Exclude keys from user
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class AuthAdminService {
  async execute({ email, password }: IAuthenticateRequest) {
    if (!email) {
      throw new Error('E-mail é obrigatório.')
    }

    if (!password) {
      throw new Error('Senha é obrigatória.')
    }

    const user = await prismaClient.usuario.findFirst({
      where: {
        email,
        tipoAcesso: 'admin',
        deleted: false,
      },
    })

    if (!user) {
      throw new Error('E-mail/Senha incorretos.')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('E-mail/Senha incorretos.')
    }

    const token = sign(
      {
        matricula: user.matricula,
      },
      process.env.AUTH_TOKEN as string,
      {
        subject: user.id,
      },
    )

    const userWithoutSensiveKeys = exclude(user, ['password'])

    const response = {
      token,
      user: userWithoutSensiveKeys,
    }

    return response
  }
}

export { AuthAdminService }
