import { Request, Response } from 'express'
import { SaveImovelService } from '../../../services/common/imoveis/SaveImovelService'

class SaveImovelController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
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
    } = request.body

    try {
      const saveImovelService = new SaveImovelService()

      const property = await saveImovelService.execute({
        propertyType,
        quartos: parseInt(quartos, 10),
        banheiros: parseInt(banheiros, 10),
        garagem: parseInt(garagem, 10),
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
      })

      return response
        .status(201)
        .json({ message: 'Imóvel salvo com sucesso', property })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SaveImovelController }
