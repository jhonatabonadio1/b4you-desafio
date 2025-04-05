import { logger } from '../../../config/logger'
import { prismaClient } from '../../../database/prismaClient'

interface IUpdateCampaingRequest {
  id: string
  nome: string
  orcamento: number
  status: number
  userId: string
}

class UpdateCampaingService {
  async execute({
    id,
    nome,
    orcamento,
    status,
    userId,
  }: IUpdateCampaingRequest) {
    logger.info('Iniciando atualização da campanha', { campaignId: id, userId })

    if (!id) {
      logger.error('Campos obrigatórios não preenchidos', { campaignId: id })
      throw new Error('Preencha os campos obrigatórios.')
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

    const VALOR_ORCAMENTO_CENTS = orcamento * 100

    let statusMessage: string

    switch (status) {
      case 0:
        statusMessage = 'inativo'
        break
      case 1:
        statusMessage = 'ativo'
        break
      case 2:
        statusMessage = 'pausado'
        break
      default:
        statusMessage = 'inativo'
        break
    }

    const UPDATED_DATA = {
      nome: nome ?? buscaCampanha.nome,
      orcamento: orcamento ? VALOR_ORCAMENTO_CENTS : buscaCampanha.orcamento,
      status: status ? statusMessage : buscaCampanha.status,
    }

    const campaing = await prismaClient.campaing.update({
      where: { id: buscaCampanha.id },
      data: UPDATED_DATA,
    })

    logger.info('Campanha atualizada com sucesso', {
      campaignId: campaing.id,
      userId,
      updatedData: UPDATED_DATA,
    })

    return campaing
  }
}

export { UpdateCampaingService }
