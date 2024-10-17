/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaClient } from '../database/prismaClient'

interface IServico {
  id: string
}

class GetServiceInfoService {
  async execute({ id }: IServico) {
    const findProduct = await prismaClient.servico.findFirst({
      where: { id, deleted: false },
      include: {
        opcoesAdicionais: true,
      },
    })

    if (!findProduct) {
      throw new Error('Serviço não encontrado.')
    }

    const prestadores = [] as any

    for (const id of findProduct.prestadores) {
      const prestador = await prismaClient.prestador.findFirst({
        where: { id, deleted: false },
      })

      if (prestador) {
        const prestadorItem = {
          razaoSocial: prestador?.razaoSocial,
          inscricao: prestador?.inscricao,
          id: prestador.id,
        }

        prestadores.push(prestadorItem)
      }
    }

    console.log(prestadores)

    return {
      ...findProduct,
      prestadores,
    }
  }
}

export { GetServiceInfoService }
