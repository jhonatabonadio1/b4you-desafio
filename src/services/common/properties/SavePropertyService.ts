import { prismaClient } from '../../../database/prismaClient'
import { ObjectId } from 'mongodb' // Para gerar IDs de metragens, valores e cidades, se necessário

type PropertiesCondominium {
    academia           Boolean
    elevador           Boolean
    lavanderiaColetiva Boolean
    piscina            Boolean
    playground         Boolean
    portaria24hrs      Boolean
    salaoDeFesta       Boolean
    sauna              Boolean
  }
  
  type PropertiesDetails {
    armariosPlanejados Boolean
    churrasqueira      Boolean
    closet             Boolean
    mobiliado          Boolean
    piscina            Boolean
    quintal            Boolean
    suite              Boolean
    varanda            Boolean
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
    metragens: { value: string }[]
    valores: { value: string }[]
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

    // Salva a propriedade no banco de dados
    const property = await prismaClient.properties.create({
      data: {
        propertyType: propertyType.map((type) => ({
          id: new ObjectId().toHexString(),
          value: type.value,
        })),
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
        cidades: cidades.map((cidade) => ({
          id: new ObjectId().toHexString(),
          value: cidade.value,
        })),
        metragens: metragens.map((metragem) => ({
          id: new ObjectId().toHexString(),
          value: metragem.value,
        })),

        valores: valores.map((valor) => ({
          id: new ObjectId().toHexString(),
          value: valor.value,
        })),
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
