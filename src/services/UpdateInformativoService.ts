import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  titulo?: string
  texto?: string
  bannerUrl?: string
  url?: string
  html?: string
}

class UpdateInformativoService {
  async execute({ id, titulo, html, texto, bannerUrl, url }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    const informativo = await prismaClient.informativos.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!informativo) {
      throw new Error('Informativo não encontrado')
    }

    const updateInformativo = await prismaClient.informativos.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        titulo: titulo || informativo.titulo,
        texto: texto || informativo.texto,
        bannerUrl: bannerUrl || informativo.bannerUrl,
        html: html || informativo.html,
        url: url || informativo.url,
      },
    })

    return updateInformativo
  }
}

export { UpdateInformativoService }
