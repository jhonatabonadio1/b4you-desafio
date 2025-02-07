/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ListAllPropertiesService } from '../../../services/common/properties/ListAllPropertiesService'

type FilterType = {
  quartos: string
  banheiros: string
  vagas: string
  metragemDe: string
  metragemAte: string
  valorDe: string
  valorAte: string
  condominio: string[]
  detalhesImovel: string[]
  estado: string
  cidade: string
  tipo: string
  user: {
    value: string
    label: string
  }
  formas: string
  envioPendente: boolean
}

class ListAllPropertiesController {
  async handle(request: Request, response: Response) {
    const { clienteFuturo, page, search, me } = request.query
    const { filters } = request.body
    const { userId } = request

    const service = new ListAllPropertiesService()

    try {
      const properties = await service.execute({
        clienteFuturo: clienteFuturo === 'true',
        page: page ? Number(page) : undefined,
        search: search as string | undefined,
        filters: filters as FilterType | undefined,
        userId,
        me: !!me,
      })

      return response.status(200).json(properties)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export { ListAllPropertiesController }
