import { prismaClient } from '../../../database/prismaClient'
import { DownloadImagesService } from '../../../services/common/images/DownloadImagesService'

class DownloadImovelImagesService {
  async execute(imovelCode: string): Promise<Buffer> {
    if (!imovelCode) {
      throw new Error('O código do imóvel é obrigatório.')
    }

    // Busca o imóvel pelo código
    const imovel = await prismaClient.imovels.findFirst({
      where: {
        imovelCode,
      },
    })

    if (!imovel || !imovel.images || imovel.images.length === 0) {
      throw new Error('Imóvel não encontrado ou sem imagens.')
    }

    const downloadImagesService = new DownloadImagesService()

    // Usa o serviço de imagens para baixar e zipar as imagens
    return downloadImagesService.downloadAndZipImages(imovel.images, imovelCode)
  }
}

export { DownloadImovelImagesService }
