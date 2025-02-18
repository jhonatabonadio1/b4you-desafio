import { prismaClient } from '../../../database/prismaClient'

interface PageAnalytics {
  pageNumber: number
  views: number
  totalTime: number
  averageTime: number
  minTime: number
  maxTime: number
}

export class FetchPagesAnalyticsService {
  async execute(
    docId: string,
    userId: string,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<PageAnalytics[]> {
    if (!docId) {
      throw new Error('Documento inválido')
    }
    const buscaDocumento = await prismaClient.document.findFirst({
      where: { id: docId },
    })

    if (!buscaDocumento) {
      throw new Error('Documento não encontrado.')
    }

    if (buscaDocumento?.userId !== userId) {
      throw new Error('Usuário não autorizado')
    }

    const whereClause: any = { session: { docId } }

    if (dataInicio || dataFim) {
      whereClause.createdAt = {}
      if (dataInicio) whereClause.createdAt.gte = dataInicio
      if (dataFim) whereClause.createdAt.lte = dataFim
    }

    const data = await prismaClient.pageView.findMany({
      where: whereClause,
      select: {
        pageNumber: true,
        interactionTime: true,
      },
    })

    if (!data.length) {
      return []
    }

    // Agrupar dados por página
    const analytics: {
      [key: number]: {
        totalTime: number
        count: number
        min: number
        max: number
      }
    } = {}

    data.forEach(({ pageNumber, interactionTime }) => {
      if (!analytics[pageNumber]) {
        analytics[pageNumber] = {
          totalTime: 0,
          count: 0,
          min: interactionTime,
          max: interactionTime,
        }
      }

      analytics[pageNumber].totalTime += interactionTime
      analytics[pageNumber].count += 1
      analytics[pageNumber].min = Math.min(
        analytics[pageNumber].min,
        interactionTime,
      )
      analytics[pageNumber].max = Math.max(
        analytics[pageNumber].max,
        interactionTime,
      )
    })

    // Criar array formatado com os dados
    const result: PageAnalytics[] = Object.entries(analytics).map(
      ([page, { totalTime, count, min, max }]) => ({
        pageNumber: Number(page),
        views: count,
        totalTime: Math.round(totalTime), // Tempo total de leitura
        averageTime: Math.round(totalTime / count), // Tempo médio de leitura
        minTime: Math.round(min), // Menor tempo registrado
        maxTime: Math.round(max), // Maior tempo registrado
      }),
    )

    return result
  }
}
