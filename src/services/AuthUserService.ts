import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prismaClient } from '../database/prismaClient'

interface IAuthenticateRequest {
  matricula: string
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

class AuthUserService {
  async execute({ matricula, password }: IAuthenticateRequest) {
    if (!matricula) {
      throw new Error('Matrícula é obrigatória.')
    }

    if (!password) {
      throw new Error('Senha é obrigatória.')
    }

    const user = await prismaClient.usuario.findFirst({
      where: {
        matricula,
        deleted: false,
      },
    })

    if (!user) {
      throw new Error('Matrícula/Senha incorretos.')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Matrícula/Senha incorretos.')
    }

    const token = sign(
      {
        matricula: user.matricula,
      },
      '44697ae110c97c0a7b0eba9568f9c0aa',
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

export { AuthUserService }
