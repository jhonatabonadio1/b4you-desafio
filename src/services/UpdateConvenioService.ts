import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  titulo?: string
  texto?: string
  bannerUrl?: string
  url?: string
  html?: string
  categoria?: string
  ativo?: boolean
}

class UpdateConvenioService {
  async execute({
    id,
    titulo,
    texto,
    bannerUrl,
    url,
    html,
    categoria,
    ativo,
  }: IRequest) {
    if (!id) {
      throw new Error('ID do convênio é obrigatório')
    }

    const existingConvenio = await prismaClient.convenios.findUnique({
      where: { id, deleted: false },
    })

    if (!existingConvenio) {
      throw new Error('Convênio não encontrado')
    }

    const updatedConvenio = await prismaClient.convenios.update({
      where: { id, deleted: false },
      data: {
        titulo: titulo || existingConvenio.titulo,
        texto: texto || existingConvenio.texto,
        bannerUrl: bannerUrl || existingConvenio.bannerUrl,
        url: url || existingConvenio.url,
        html: html || existingConvenio.html,
        ativo,
        categoria: categoria || existingConvenio.categoria,
      },
    })

    return updatedConvenio
  }
}

export { UpdateConvenioService }
