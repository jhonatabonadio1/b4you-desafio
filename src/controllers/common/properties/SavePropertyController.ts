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
    const { userId } = request // obtido do middleware de autenticação

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
      metragens: { value: number }[]
      valores: { value: number }[]
      nome: string
      details: ImovelsDetails
      condominium: ImovelsCondominium
    } = request.body

    try {
      // 1) Validação simples
      if (!propertyType || propertyType.length === 0) {
        return response
          .status(400)
          .json({ error: 'Tipo de imóvel é obrigatório.' })
      }

      if (isNaN(quartos) || quartos < 0) {
        return response
          .status(400)
          .json({ error: "Campo 'quartos' é obrigatório e deve ser >= 0." })
      }

      if (isNaN(banheiros) || banheiros < 0) {
        return response
          .status(400)
          .json({ error: "Campo 'banheiros' é obrigatório e deve ser >= 0." })
      }

      if (isNaN(garagem) || garagem < 0) {
        return response
          .status(400)
          .json({ error: "Campo 'garagem' é obrigatório e deve ser >= 0." })
      }

      if (!paymentMethod) {
        return response
          .status(400)
          .json({ error: "Campo 'forma de pagamento' é obrigatório." })
      }

      if (!state) {
        return response
          .status(400)
          .json({ error: "Campo 'estado' é obrigatório." })
      }

      if (!cidades || cidades.length === 0) {
        return response
          .status(400)
          .json({ error: "Pelo menos uma cidade em 'cidades' é obrigatória." })
      }

      if (!metragens || metragens.length === 0) {
        return response.status(400).json({
          error: "Pelo menos uma metragem em 'metragens' é obrigatória.",
        })
      }

      if (!valores || valores.length === 0) {
        return response
          .status(400)
          .json({ error: "Pelo menos um valor em 'valores' é obrigatório." })
      }

      if (!nome) {
        return response
          .status(400)
          .json({ error: "Campo 'nome' é obrigatório." })
      }

      if (!details) {
        return response
          .status(400)
          .json({ error: "Objeto 'details' é obrigatório." })
      }

      if (!condominium) {
        return response
          .status(400)
          .json({ error: "Objeto 'condomínio' é obrigatório." })
      }

      // 2) Se passou pelas validações, chama o service
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
