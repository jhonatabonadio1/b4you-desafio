import { prismaClient } from '../../../database/prismaClient'
import { CalculateLastUpdateService } from './CalculateLastUpdateService'

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

class ListAllPropertiesService {
  async execute({
    page = 1,
    search = '',
    clienteFuturo,
    filters,
    userId,
    me,
  }: {
    page?: number
    search?: string
    clienteFuturo?: boolean
    userId?: string
    filters?: FilterType
    me?: boolean
  }) {
    const pageSize = 10
    const conditions: any = {}

    if (clienteFuturo !== undefined) {
      conditions.clienteFuturo = clienteFuturo
    }

    if (me) {
      conditions.user = userId
    }

    if (search) {
      conditions.OR = [
        { descricao: { contains: search, mode: 'insensitive' } },
        { clientCode: { contains: search, mode: 'insensitive' } },
        {
          cidades: {
            some: { value: { contains: search, mode: 'insensitive' } },
          },
        },
      ]
    }

    if (filters?.quartos) {
      conditions.quartos = parseInt(filters.quartos)
    }

    if (filters?.banheiros) {
      conditions.banheiros = parseInt(filters.banheiros)
    }

    if (filters?.vagas) {
      conditions.garagem = parseInt(filters.vagas)
    }

    if (filters?.user && filters.user.value) {
      conditions.user = filters.user.value
    }
    if (filters?.valorDe || filters?.valorAte) {
      conditions.valores = {
        some: {
          value: {
            gte: filters.valorDe ? parseFloat(filters.valorDe) : 0,
            lte: filters.valorAte ? parseFloat(filters.valorAte) : 999999999999,
          },
        },
      }
    }

    if (filters?.metragemDe || filters?.metragemAte) {
      conditions.metragens = {
        some: {
          value: {
            gte: filters.metragemDe ? parseFloat(filters.metragemDe) : 0,
            lte: filters.metragemAte
              ? parseFloat(filters.metragemAte)
              : 999999999999,
          },
        },
      }
    }
    if (filters?.estado) {
      conditions.state = filters.estado
    }

    if (filters?.cidade) {
      conditions.cidades = {
        some: { value: filters.cidade },
      }
    }

    if (filters?.tipo) {
      conditions.propertyType = {
        some: { value: filters.tipo },
      }
    }

    if (filters?.formas) {
      conditions.paymentMethod = filters.formas
    }

    if (filters?.envioPendente) {
      conditions.links = {
        some: {
          encaminhado: false,
        },
      }
    }

    const totalProperties = await prismaClient.properties.count({
      where: conditions,
    })
    const totalPages = Math.ceil(totalProperties / pageSize)

    const properties = await prismaClient.properties.findMany({
      where: conditions,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        timestamp: 'desc',
      },
    })

    const calculateLastUpdateService = new CalculateLastUpdateService()

    const data = await Promise.all(
      properties.map(async (property) => {
        const user = await prismaClient.users.findFirst({
          where: { id: property.user, deleted: false },
        })

        const lastUpdate = await calculateLastUpdateService.execute(property.id)

        return {
          ...property,
          userName: user?.nome || 'Usuário Desconhecido',
          lastLinkUpdate: lastUpdate,
        }
      }),
    )

    const emptyFilter = {
      quartos: '',
      banheiros: '',
      vagas: '',
      metragemDe: '',
      metragemAte: '',
      valorDe: '',
      valorAte: '',
      condominio: [],
      detalhesImovel: [],
      estado: '',
      cidade: '',
      user: {
        value: '',
        label: '',
      },
      tipo: '',
      formas: '',
      envioPendente: false,
    }

    const filtersCount = Object.entries(filters || {}).reduce(
      (count, [key, value]) => {
        const emptyValue = emptyFilter[key as keyof typeof emptyFilter]

        if (
          key === 'user' &&
          typeof value === 'object' &&
          value !== null &&
          'value' in value
        ) {
          // Verifica se emptyValue também é um objeto antes de acessar .value
          if (
            typeof emptyValue === 'object' &&
            emptyValue !== null &&
            'value' in emptyValue
          ) {
            if (value.value !== emptyValue.value && value.value !== 'Todos') {
              return count + 1
            }
          }
          return count
        }

        if (Array.isArray(value) && value.length > 0) return count + 1
        if (typeof value === 'boolean' && value !== emptyValue) return count + 1
        if (typeof value === 'string' && value !== '' && value !== emptyValue)
          return count + 1

        return count
      },
      0,
    )

    return {
      properties: data,
      currentPage: page,
      totalPages,
      totalProperties,
      filters: { ...emptyFilter, ...filters },
      filtersCount,
    }
  }
}

export { ListAllPropertiesService }
