import { prismaClient } from '../database/prismaClient'

interface IRequest {
  titulo: string
  texto?: string
  bannerUrl?: string
  url?: string
  html?: string
}

class CreateInformativoService {
  async execute({ titulo, texto, html, bannerUrl, url }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    const informativo = await prismaClient.informativos.create({
      data: {
        titulo,
        texto,
        html,
        bannerUrl:
          bannerUrl ||
          'https://pip.global/static/1632e46a5c79d43f3125ca62c54189cb/ba986/hills_placeholder.png',
        url,
      },
    })

    return informativo
  }
}

export { CreateInformativoService }
