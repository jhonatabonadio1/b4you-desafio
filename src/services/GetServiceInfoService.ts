/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaClient } from '../database/prismaClient'

interface IServico {
  id: string
}

class GetServiceInfoService {
  async execute({ id }: IServico) {
    const findProduct = await prismaClient.servico.findFirst({
      where: { id, deleted: false },
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

    // Realiza o JSON parse nas opções adicionais e adiciona no findProduct
    if (findProduct.opcoesAdicionais) {
      try {
        findProduct.opcoesAdicionais = JSON.parse(findProduct.opcoesAdicionais)
      } catch (error) {
        console.error(
          'Erro ao fazer o JSON parse das opções adicionais:',
          error,
        )
      }
    }

    return {
      ...findProduct,
      prestadores, // Adiciona os prestadores no retorno
    }
  }
}

export { GetServiceInfoService }
