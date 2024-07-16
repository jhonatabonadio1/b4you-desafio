import { prismaClient } from '../database/prismaClient'

interface IRequest {
  titulo: string
  texto?: string
  bannerUrl?: string
  url: string
  html?: string
  categoria: string
}

class CreateConvenioService {
  async execute({ titulo, bannerUrl, texto, url, html, categoria }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    if (!categoria) {
      throw new Error('Categoria é obrigatório.')
    }

    if (!url) {
      throw new Error('URL de redirecionamento é obrigatório.')
    }

    const convenio = await prismaClient.convenios.create({
      data: {
        titulo,
        texto,
        bannerUrl:
          bannerUrl ||
          'https://pip.global/static/1632e46a5c79d43f3125ca62c54189cb/ba986/hills_placeholder.png',
        url,
        html,
        ativo: true,
        categoria,
      },
    })

    return convenio
  }
}

export { CreateConvenioService }
