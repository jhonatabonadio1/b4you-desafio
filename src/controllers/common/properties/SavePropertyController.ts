import { Request, Response } from 'express'
import { SavePropertyService } from '../../../services/common/properties/SavePropertyService'

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

class SavePropertyController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
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
      nome,
      details,
      condominium,
    }: {
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
    } = request.body

    try {
      const savePropertyService = new SavePropertyService()

      const property = await savePropertyService.execute({
        propertyType,
        quartos: parseInt(quartos.toString(), 10),
        banheiros: parseInt(banheiros.toString(), 10),
        garagem: parseInt(garagem.toString(), 10),
        paymentMethod,
        descricao,
        state,
        cidades,
        metragens,
        valores,
        nome,
        details,
        condominium,
        userId,
      })

      return response
        .status(201)
        .json({ message: 'Propriedade salva com sucesso', property })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SavePropertyController }
