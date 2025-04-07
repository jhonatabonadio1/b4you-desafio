import { logger } from '../../../config/logger'
import { prismaClient } from '../../../database/prismaClient'

interface IReadCampaingRequest {
  userId: string
}

class ReadCampaingService {
  async execute({ userId }: IReadCampaingRequest) {
    logger.info('Buscando campanhas para o usuário', { userId })
    const buscaCampanha = await prismaClient.campaing.findMany({
      where: { user: { id: userId, deleted: false }, deleted: false },
    })

    logger.info('Campanhas retornadas', { userId, total: buscaCampanha.length })
    return buscaCampanha
  }
}

export { ReadCampaingService }
