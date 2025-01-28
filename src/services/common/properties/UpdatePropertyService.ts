import { prismaClient } from '../../../database/prismaClient'
import { ObjectId } from 'mongodb' // Para gerar IDs únicos

type ImovelsCondominium = {
  academia: boolean
  elevador: boolean
  lavanderiaColetiva: boolean
  piscina: boolean
  playground: boolean
  portaria24hrs: boolean
  salaoDeFesta: boolean
  sauna: boolean
}

type ImovelsDetails = {
  armariosPlanejados: boolean
  churrasqueira: boolean
  closet: boolean
  mobiliado: boolean
  piscina: boolean
  quintal: boolean
  suite: boolean
  varanda: boolean
}

class UpdatePropertyService {
  async execute(data: {
    propertyId: string
    propertyType: { value: string }[]
    quartos: number
    banheiros: number
    garagem: number
    paymentMethod: string
    descricao: string
    state: string
    cidades: { value: string }[]
    metragens: { value: string }[]
    valores: { value: string }[]
    nome: string
    details: ImovelsDetails
    condominium: ImovelsCondominium
    encaminhado?: boolean
    linkImovel?: string
    fonte?: string
    userId: string
  }) {
    const {
      propertyId,
      propertyType,
      quartos,
      banheiros,
      garagem,
      paymentMethod,
      descricao,
      state,
      cidades,
      metragens,
      valores,
      nome,
      details,
      condominium,
      encaminhado,
      linkImovel,
      fonte,
      userId,
    } = data

    if (!propertyId) {
      throw new Error('O ID da propriedade é obrigatório.')
    }

    // Busca a propriedade pelo ID e garante que o usuário é o proprietário ou administrador
    const property = await prismaClient.properties.findUnique({
      where: { id: propertyId },
    })

    if (!property || property.user !== userId) {
      throw new Error('Propriedade não encontrada ou usuário não autorizado.')
    }

    // Formatar valores como moeda local (BRL)
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    const formattedValores = valores.map((valor) => ({
      id: new ObjectId().toHexString(), // Gera um ID único
      value: formatter.format(parseFloat(valor.value.replace(',', '.'))),
    }))

    // Adicionar IDs aos itens de `cidades` e `metragens`
    const cidadesWithIds = cidades.map((cidade) => ({
      id: new ObjectId().toHexString(), // Gera um ID único
      value: cidade.value,
    }))

    const metragensWithIds = metragens.map((metragem) => ({
      id: new ObjectId().toHexString(), // Gera um ID único
      value: metragem.value,
    }))

    // Atualiza os dados no banco de dados
    const updatedProperty = await prismaClient.properties.update({
      where: { id: propertyId },
      data: {
        propertyType: {
          set: propertyType.map((type) => ({
            id: new ObjectId().toHexString(), // Gera ID único para cada tipo
            value: type.value,
          })),
        },
        details,
        condominium,
        quartos,
        banheiros,
        garagem,
        paymentMethod,
        descricao,
        state,
        cidades: {
          set: cidadesWithIds, // Substitui com os novos dados incluindo IDs
        },
        metragens: {
          set: metragensWithIds, // Substitui com os novos dados incluindo IDs
        },
        valores: {
          set: formattedValores, // Substitui com os novos valores incluindo IDs
        },
        nome,
        encaminhado,
        linkImovel,
        fonte,
      },
    })

    return updatedProperty
  }
}

export { UpdatePropertyService }
