import { prismaClient } from '../../../database/prismaClient'

interface ICaptureHeatmapsRequest {
  docId: string
  lote: {
    x: number
    y: number
    value: number
    pageWidth: number
    pageHeight: number
    page: number
  }[]
}

class CaptureHeatmapsService {
  async execute({ docId, lote }: ICaptureHeatmapsRequest) {
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!docId) {
      throw new Error('ID do documento é obrigatório')
    }

    if (lote.length <= 0) {
      throw new Error('Lote de heatmaps é obrigatório')
    }

    // FUTURO: AQUI REALIZAR A VERIFICAÇÃO DE FINGERPRINT

    const createLoteHeatmaps = await prismaClient.loteHeatmaps.create({
      data: {
        docId,
      },
    })

    if (!createLoteHeatmaps) {
      throw new Error('Não foi possível criar o lote de heatmaps.')
    }

    const loteVerificado = []

    for (const item of lote) {
      if (item.page == null) {
        continue
      }

      // Se passou na validação, adiciona ao array
      loteVerificado.push(item)
    }

    const uploadCarga = await prismaClient.heatmaps.createMany({
      data: loteVerificado.map((item) => ({
        loteId: createLoteHeatmaps.id, // Corrigido nome da referência
        ...item,
      })),
    })

    if (!uploadCarga) {
      throw new Error('Não foi possível carregar o lote.')
    }

    return { message: 'Lote carregado com sucesso' }
  }
}

export { CaptureHeatmapsService }
