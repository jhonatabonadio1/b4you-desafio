import { logger } from '../../../config/logger'
import { prismaClient } from '../../../database/prismaClient'

interface IFetchUserData {
  userId: string
}

class FetchUserDataService {
  async execute({ userId }: IFetchUserData) {
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
