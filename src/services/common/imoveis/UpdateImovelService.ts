import { ObjectId } from 'mongodb'
import { prismaClient } from '../../../database/prismaClient'

class UpdateImovelService {
  async execute(data: {
    _id: string
    propertyType?: string
    quartos?: number
    banheiros?: number
    garagem?: number
    descricao?: string
    state?: string
    cidade?: string
    valor?: string
    valorCondo?: string
    metragens?: string[]
    images?: string[]
    valorComissao?: string
    details?: any
    condominium?: any
    ownerName?: string
    ownerPhone?: string
    ownerEmail?: string
    ownerWhatsapp?: string
    userId: string
  }) {
    const {
      _id,
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
      valorComissao,
      details,
      condominium,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerWhatsapp,
      userId,
    } = data

    if (!_id) {
      throw new Error('O ID do imóvel é obrigatório.')
    }

    // Busca o imóvel pelo ID
    const property = await prismaClient.imovels.findUnique({
      where: { id: _id },
    })

    if (!property) {
      throw new Error('Imóvel não encontrado.')
    }

    // Verifica se o usuário atual é o dono do imóvel
    if (property.user !== userId) {
      throw new Error('Permissão negada.')
    }

    const metragensWithIds = metragens
      ? metragens.map((metragem) => ({
          id: new ObjectId().toHexString(), // Gera um novo ObjectId para cada metragem
          value: metragem,
        }))
      : undefined

    // Atualiza os campos do imóvel
    const updatedProperty = await prismaClient.imovels.update({
      where: { id: _id },
      data: {
        propertyType,
        quartos,
        banheiros,
        garagem,
        descricao,
        state,
        cidade,
        valor,
        valorCondo,
        metragens: metragensWithIds ? { set: metragensWithIds } : undefined,
        images,
        valorComissao,
        details,
        condominium,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerWhatsapp,
      },
    })

    return updatedProperty
  }
}

export { UpdateImovelService }
