import { Request, Response } from 'express'
import { UpdateImovelService } from '../../../services/common/imoveis/UpdateImovelService'

class UpdateImovelController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
    const { id } = request.query
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
      valorComissao,
      details,
      condominium,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerWhatsapp,
    } = request.body

    try {
      const updateImovelService = new UpdateImovelService()

      const updatedProperty = await updateImovelService.execute({
        _id: id as string,
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
        valorComissao,
        details,
        condominium,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerWhatsapp,
        userId,
      })

      return response
        .status(200)
        .json({ message: 'Imóvel atualizado com sucesso', updatedProperty })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { UpdateImovelController }
