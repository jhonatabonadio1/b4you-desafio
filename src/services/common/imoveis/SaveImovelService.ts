import { prismaClient } from '../../../database/prismaClient'
import { ObjectId } from 'mongodb'

class SaveImovelService {
  async execute(data: {
    propertyType: string
    quartos: number
    banheiros: number
    garagem: number
    descricao: string
    state: string
    cidade: string
    valor: string
    valorCondo?: string
    metragens: string[]
    images: string[]
    details: any
    condominium: any
    valorComissao?: string
    ownerName: string
    ownerPhone: string
    ownerEmail?: string
    ownerWhatsapp?: string
    userId: string
  }) {
    const {
      propertyType,
      quartos,
      banheiros,
      garagem,
      descricao,
      state,
      cidade,
      valor,
      valorCondo,
      metragens,
      images,
      details,
      condominium,
      valorComissao,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerWhatsapp,
      userId,
    } = data

    if (!images || images.length === 0) {
      throw new Error('Pelo menos uma imagem é obrigatória.')
    }

    // Gera um código único para o imóvel
    const imovelCode = await this.gerarNumeroUnicoDeQuatroDigitos()

    // Adiciona IDs únicos para cada item em "metragens"
    const metragensWithId = metragens.map((value) => ({
      id: new ObjectId().toHexString(), // Gera um ID único para cada metragem
      value,
    }))

    // Salva o imóvel no banco de dados
    const property = await prismaClient.imovels.create({
      data: {
        v: 0,
        propertyType,
        quartos,
        banheiros,
        garagem,
        descricao,
        state,
        cidade,
        valor,
        valorCondo,
        metragens: metragensWithId,
        images,
        details,
        condominium,
        valorComissao,
        user: userId,
        imovelCode: imovelCode.toString(),
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerWhatsapp,
        timestamp: new Date(),
      },
    })

    return property
  }

  private async gerarNumeroUnicoDeQuatroDigitos() {
    let numeroAleatorio = 0
    let numeroExiste = true

    while (numeroExiste) {
      numeroAleatorio = Math.floor(1000 + Math.random() * 9000) // Gera número aleatório de 4 dígitos
      const propriedadeExistente = await prismaClient.imovels.findFirst({
        where: { imovelCode: String(numeroAleatorio) },
      })
      if (!propriedadeExistente) {
        numeroExiste = false
      }
    }
    return numeroAleatorio
  }
}

export { SaveImovelService }
