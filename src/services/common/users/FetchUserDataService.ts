import { prismaClient } from '../../../database/prismaClient'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

class FetchUserDataService {
  async execute(userId: string) {
    if (!userId) {
      logger.error('O ID do usuário é obrigatório.')
      throw new Error('O ID do usuário é obrigatório.')
    }
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
    })
    if (!user) {
      logger.error('Usuário não encontrado.', { userId })
      throw new Error('Usuário não encontrado.')
    }
    logger.info('Dados do usuário buscados com sucesso.', {
      userId: user.id,
      email: user.email,
    })
    return user
  }
}

export { FetchUserDataService }
