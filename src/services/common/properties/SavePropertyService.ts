import { prismaClient } from '../../../database/prismaClient'

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

class SavePropertyService {
  async execute(data: {
    propertyType: { value: string }[]
    quartos: number
    banheiros: number
    garagem: number
    paymentMethod: string
    descricao: string
    state: string
    cidades: { value: string }[]
    metragens: { value: number }[]
    valores: { value: number }[]
    userId: string
    nome: string
    details: ImovelsDetails
    condominium: ImovelsCondominium
  }) {
    const {
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
      userId,
      nome,
      details,
      condominium,
    } = data

    // Gera um código único para o cliente
    const clientCode = await this.gerarNumeroUnicoDeQuatroDigitos()

    const metragensWithId = metragens.map((value) => ({
      value: value.value,
    }))
    const typesWithId = propertyType.map((value) => ({
      value: value.value,
    }))
    const valuesWithId = valores.map((value) => ({
      value: value.value,
    }))
    const cidadesWithId = cidades.map((value) => ({
      value: value.value,
    }))

    // Salva a propriedade no banco de dados
    const property = await prismaClient.properties.create({
      data: {
        propertyType: typesWithId,
        v: 0,
        quartos,
        details,
        condominium,
        nome,
        banheiros,
        garagem,
        paymentMethod,
        descricao,
        state,
        cidades: cidadesWithId,
        metragens: metragensWithId,
        valores: valuesWithId,
        user: userId,
        clientCode: clientCode.toString(),
        timestamp: new Date(),
      },
    })

    return property
  }

  private async gerarNumeroUnicoDeQuatroDigitos(): Promise<number> {
    let numeroAleatorio: number = 0
    let numeroExiste = true

    while (numeroExiste) {
      numeroAleatorio = Math.floor(1000 + Math.random() * 9000) // Gera número aleatório de 4 dígitos
      const propriedadeExistente = await prismaClient.properties.findFirst({
        where: { clientCode: numeroAleatorio.toString() },
      })
      if (!propriedadeExistente) {
        numeroExiste = false
      }
    }
    return numeroAleatorio
  }
}

export { SavePropertyService }
