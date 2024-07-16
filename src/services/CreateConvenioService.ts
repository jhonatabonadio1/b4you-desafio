import { prismaClient } from '../database/prismaClient'

interface IRequest {
  titulo: string
  texto?: string
  bannerUrl: string
  url: string
  html?: string
  categoria: string
}

class CreateConvenioService {
  async execute({ titulo, texto, bannerUrl, url, html, categoria }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    if (!bannerUrl) {
      throw new Error('URL do banner é obrigatório')
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
        bannerUrl,
        url,
        html,
        categoria,
      },
    })

    return convenio
  }
}

export { CreateConvenioService }
