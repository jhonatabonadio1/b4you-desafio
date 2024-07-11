import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  titulo?: string
  texto?: string
  bannerUrl?: string
  url?: string
}

class UpdateInformativoService {
  async execute({ id, titulo, texto, bannerUrl, url }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    const informativo = await prismaClient.informativos.findFirst({
      where: {
        id,
      },
    })

    if (!informativo) {
      throw new Error('Informativo não encontrado')
    }

    const updateInformativo = await prismaClient.informativos.update({
      where: {
        id,
      },
      data: {
        titulo: titulo || informativo.titulo,
        texto: texto || informativo.texto,
        bannerUrl: bannerUrl || informativo.bannerUrl,
        url: url || informativo.url,
      },
    })

    return updateInformativo
  }
}

export { UpdateInformativoService }
