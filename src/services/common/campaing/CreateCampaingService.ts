import { logger } from '../../../config/logger'
import { prismaClient } from '../../../database/prismaClient'

interface ICreateCampaingRequest {
  nome: string
  orcamento: number
  status: number
  userId: string
}

class CreateCampaingService {
  async execute({ nome, orcamento, status, userId }: ICreateCampaingRequest) {
    logger.info('Iniciando criação de campanha', {
      nome,
      orcamento,
      status,
      userId,
    })

    if (!nome || !orcamento || !status) {
      logger.error('Campos obrigatórios não preenchidos', {
        nome,
        orcamento,
        status,
      })
      throw new Error('Preencha os campos obrigatórios.')
    }

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
    logger.info('Status convertido', { status, statusMessage })

    const buscaUsuario = await prismaClient.user.findUnique({
      where: { id: userId, deleted: false },
    })

    if (!buscaUsuario) {
      logger.error('Usuário não encontrado/autorizado', { userId })
      throw new Error('Usuário não encontrado/autorizado.')
    }

    const VALOR_ORCAMENTO_CENTS = orcamento * 100

    const campaing = await prismaClient.campaing.create({
      data: {
        nome,
        orcamento: VALOR_ORCAMENTO_CENTS,
        status: statusMessage,
        user: {
          connect: buscaUsuario,
        },
      },
    })

    logger.info('Campanha criada com sucesso', {
      campaingId: campaing.id,
      userId,
    })
    return campaing
  }
}

export { CreateCampaingService }
