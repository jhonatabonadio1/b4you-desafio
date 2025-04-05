import { logger } from '../../../config/logger'
import { prismaClient } from '../../../database/prismaClient'

interface IDeleteCampaingRequest {
  id: string
  userId: string
}

class DeleteCampaingService {
  async execute({ id, userId }: IDeleteCampaingRequest) {
    logger.info('Iniciando deleção da campanha', { campaignId: id, userId })
    if (!id) {
      logger.error('ID da campanha não informado', { campaignId: id })
      throw new Error('ID da campanha não informado;')
    }
    const buscaUsuario = await prismaClient.user.findUnique({
      where: { id: userId, deleted: false },
    })
    if (!buscaUsuario) {
      logger.error('Usuário não encontrado/autorizado', { userId })
      throw new Error('Usuário não encontrado/autorizado.')
    }
    const buscaCampanha = await prismaClient.campaing.findUnique({
      where: { id, user: { id: buscaUsuario.id }, deleted: false },
    })
    if (!buscaCampanha) {
      logger.error('Campanha não encontrada', { campaignId: id, userId })
      throw new Error('Campanha não encontrada.')
    }
    await prismaClient.campaing.update({
      where: { id: buscaCampanha.id },
      data: { deleted: true },
    })
    logger.info('Campanha excluída com sucesso', {
      campaignId: buscaCampanha.id,
      userId,
    })
    return { message: 'Camapanha excluída' }
  }
}

export { DeleteCampaingService }
