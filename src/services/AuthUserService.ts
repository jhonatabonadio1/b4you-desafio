import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prismaClient } from '../database/prismaClient'

interface IAuthenticateRequest {
  matricula: string
  password: string
  accessType: number
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
  async execute({ matricula, password, accessType }: IAuthenticateRequest) {
    if (!matricula) {
      throw new Error('Login é obrigatório.')
    }

    if (!password) {
      throw new Error('Senha é obrigatória.')
    }

    if (!accessType) {
      throw new Error('Tipo de acesso é obrigatório.')
    }

    if (accessType !== 1 && accessType !== 2) {
      throw new Error('Tipo de acesso inválido.')
    }

    if (accessType === 1) {
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
        user: {
          ...userWithoutSensiveKeys,
          nascimento: user.birth,
        },
        accessType,
      }

      return response
    }

    const inscricaoString = matricula.toString().replace(/\D/g, '')

    if (accessType === 2) {
      const user = await prismaClient.prestador.findFirst({
        where: {
          inscricao: inscricaoString,
          deleted: false,
        },
      })

      if (!user) {
        throw new Error('Inscrição/Senha incorretos.')
      }

      const passwordMatch = await compare(password, user.password)

      if (!passwordMatch) {
        throw new Error('Inscrição/Senha incorretos.')
      }

      const token = sign(
        {
          inscricao: user.inscricao,
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
        accessType,
      }

      return response
    }
  }
}

export { AuthUserService }
