import { Request, Response } from 'express'
import { UpdatePropertyService } from '../../../services/common/properties/UpdatePropertyService'

class UpdatePropertyController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
    const { propertyId } = request.query
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
      encaminhado,
      linkImovel,
      fonte,
    } = request.body

    try {
      const updatePropertyService = new UpdatePropertyService()

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

      const filteredPropertyType = propertyType.filter(
        (pt: any) => pt.value !== '',
      ) // remove onde value=''

      // cidades
      const filteredCidades = cidades.filter((c: any) => c.value !== '') // remove onde value=''

      // metragens
      const filteredMetragens = metragens
        .filter(
          (m: any) =>
            m.value !== null &&
            m.value !== undefined &&
            m.value !== 0 &&
            m.value !== '',
        )
        .map((item: any) => {
          const value = Number(item.value)

          return { value }
        })

      // valores
      const filteredValores = valores
        .filter(
          (v: any) =>
            v.value !== null &&
            v.value !== undefined &&
            v.value !== 0 &&
            v.value !== '',
        )
        .map((item: any) => {
          const value = Number(item.value)

          return { value }
        })

      const updatedProperty = await updatePropertyService.execute({
        propertyId: propertyId as string,
        propertyType: filteredPropertyType,
        quartos: parseInt(quartos, 10),
        banheiros: parseInt(banheiros, 10),
        garagem: parseInt(garagem, 10),
        paymentMethod,
        descricao,
        state,
        cidades: filteredCidades,
        metragens: filteredMetragens,
        valores: filteredValores,
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
