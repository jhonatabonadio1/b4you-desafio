import { prismaClient } from '../../../database/prismaClient'

interface ICreateSessionRequest {
  sessionId: string
  pageNumber: number
  interactionTime: number
  fingerprint: string
  network: string
}

class CreatePageViewService {
  async execute({
    sessionId,
    pageNumber,
    interactionTime,
    fingerprint,
    network,
  }: ICreateSessionRequest) {
    if (!sessionId) {
      throw new Error('Sessão inválida')
    }

    if (!pageNumber) {
      throw new Error('Página não informada')
    }

    if (!interactionTime) {
      throw new Error('Tempo de interação é obrigatório.')
    }

    const buscaSessaoValida = await prismaClient.session.findFirst({
      where: {
        id: sessionId,
        fingerprint,
        network,
      },
    })

    if (!buscaSessaoValida) {
      throw new Error('Sessão inválida')
    }

    const buscaVisualizacaoJaExiste = await prismaClient.pageView.findFirst({
      where: {
        pageNumber,
        sessionId,
      },
    })

    if (buscaVisualizacaoJaExiste) {
      throw new Error('Dados já coletados.')
    }

    const createVisualizacao = await prismaClient.pageView.create({
      data: { sessionId, pageNumber, interactionTime },
    })

    return createVisualizacao
  }
}

export { CreatePageViewService }
