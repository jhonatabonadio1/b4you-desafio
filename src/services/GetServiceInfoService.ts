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

    return findProduct
  }
}

export { GetServiceInfoService }
