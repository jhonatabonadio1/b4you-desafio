import { prismaClient } from '../database/prismaClient'

interface IRequest {
  titulo: string
  texto?: string
  bannerUrl?: string
  url?: string
}

class CreateInformativoService {
  async execute({ titulo, texto, bannerUrl, url }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    const informativo = await prismaClient.informativos.create({
      data: {
        titulo,
        texto,
        bannerUrl,
        url,
      },
    })

    return informativo
  }
}

export { CreateInformativoService }
