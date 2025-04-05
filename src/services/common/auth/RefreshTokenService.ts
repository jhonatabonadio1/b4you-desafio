import { sign, verify } from 'jsonwebtoken'
import { addDays } from 'date-fns'
import { prismaClient } from '../../../database/prismaClient'
import { logger } from '../../../config/logger'

interface ITokenPayload {
  sub: string
  email: string
}

class RefreshTokenService {
  async execute(refreshToken: string) {
    logger.info('Iniciando RefreshTokenService', {
      tokenPrefix: refreshToken.slice(0, 10),
    })
    if (!refreshToken) {
      logger.error('Refresh token não fornecido')
      throw new Error('Refresh token é obrigatório.')
    }

    const storedToken = await prismaClient.refreshToken.findFirst({
      where: { token: refreshToken },
    })

    if (!storedToken) {
      logger.error(
        'Refresh token inválido - token não encontrado no banco de dados',
        { tokenPrefix: refreshToken.slice(0, 10) },
      )
      throw new Error('Refresh token inválido.')
    }

    let decoded: ITokenPayload
    try {
      decoded = verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as ITokenPayload
    } catch (error: any) {
      logger.error('Erro na verificação do refresh token', {
        error: error.message,
      })
      throw new Error('Refresh token inválido.')
    }

    const userId = decoded.sub

    const newAccessToken = sign(
      { userId, email: decoded.email },
      process.env.JWT_SECRET as string,
      { subject: userId, expiresIn: '15m' },
    )

    const newRefreshToken = sign(
      { email: decoded.email },
      process.env.JWT_REFRESH_SECRET as string,
      { subject: userId, expiresIn: '30d' },
    )

    await prismaClient.refreshToken.deleteMany({
      where: { userId },
    })

    await prismaClient.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId,
        expiresAt: addDays(new Date(), 30),
      },
    })

    logger.info('Refresh token gerado com sucesso', {
      userId,
      accessTokenPrefix: newAccessToken.slice(0, 10),
      refreshTokenPrefix: newRefreshToken.slice(0, 10),
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
}

export { RefreshTokenService }
