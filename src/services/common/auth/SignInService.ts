import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { addDays } from 'date-fns'
import { prismaClient } from '../../../database/prismaClient'
import { logger } from '../../../config/logger'

interface ISignInRequest {
  email: string
  password: string
}

class SignInService {
  async execute({ email, password }: ISignInRequest) {
    logger.info('Iniciando SignInService', { email })
    if (!email) {
      logger.error('E-mail não fornecido')
      throw new Error('E-mail é obrigatório.')
    }
    if (!password) {
      logger.error('Senha não fornecida', { email })
      throw new Error('Senha é obrigatória.')
    }
    const user = await prismaClient.user.findFirst({
      where: { email },
    })
    if (!user) {
      logger.error('Usuário não encontrado', { email })
      throw new Error('E-mail/Senha incorretos.')
    }
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      logger.error('Senha incorreta', { email })
      throw new Error('E-mail/Senha incorretos.')
    }
    const accessToken = jwt.sign(
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

    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    )
    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 30),
      },
    })
    logger.info('Login realizado com sucesso', { userId: user.id })

    return {
      accessToken,
      refreshToken,
      user,
    }
  }
}

export { SignInService }
