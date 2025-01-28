import { Request, Response } from 'express'
import { UpdatePropertyService } from '../../../services/common/properties/UpdatePropertyService'

class UpdatePropertyController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
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
    } = request.body

    try {
      const updatePropertyService = new UpdatePropertyService()

      const updatedProperty = await updatePropertyService.execute({
        propertyId,
        propertyType,
        quartos: parseInt(quartos, 10),
        banheiros: parseInt(banheiros, 10),
        garagem: parseInt(garagem, 10),
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
      })

      return response.status(200).json({
        message: 'Propriedade atualizada com sucesso',
        updatedProperty,
      })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdatePropertyController }
