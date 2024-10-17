import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  nome?: string
  imageUrl?: string
  prestadores?: string[]
  datasDisponiveis?: string[]
  preco?: number
  precoCarroGrande?: number
  precoCarroPequeno?: number
  ativo?: boolean
  diaResetLimite?: number
  opcoesAdicionais?: {
    id?: string
    nome: string
    usoMensal?: number
  }[]
  exigeVeiculo?: boolean
  usoMensal?: number
}

class UpdateProductService {
  async execute({
    id,
    nome,
    imageUrl,
    prestadores,
    datasDisponiveis,
    diaResetLimite,
    ativo,
    usoMensal,
    opcoesAdicionais,
    exigeVeiculo,
  }: IRequest) {
    // Verificar se o produto existe
    const productExists = await prismaClient.servico.findFirst({
      where: { id, deleted: false },
      include: { opcoesAdicionais: true }, // Incluindo as opções adicionais existentes
    })

    if (!productExists) {
      throw new Error('Serviço não encontrado')
    }

    // Atualizar dados do serviço
    const updatedProduct = await prismaClient.servico.update({
      where: { id },
      data: {
        nome,
        imageUrl,
        prestadores,
        datasDisponiveis,
        diaResetLimite,
        ativo,
        usoMensal,
        exigeVeiculo,
      },
      include: {
        opcoesAdicionais: true,
      },
    })

    // Obter IDs das opções adicionais existentes no banco
    const existingOpcoesIds = productExists.opcoesAdicionais.map(
      (opcao) => opcao.id,
    )

    // Obter IDs das opções adicionais enviadas no front-end
    const updatedOpcoesIds = opcoesAdicionais?.map((opcao) => opcao.id) || []

    // Remover as opções adicionais que não estão mais presentes
    const opcoesToRemove = existingOpcoesIds.filter(
      (id) => !updatedOpcoesIds.includes(id),
    )

    if (opcoesToRemove.length > 0) {
      await prismaClient.opcaoAdicional.updateMany({
        where: { id: { in: opcoesToRemove } },
        data: { deleted: true },
      })
    }

    // Verificar e atualizar ou criar opções adicionais
    if (opcoesAdicionais && opcoesAdicionais.length > 0) {
      for (const opcao of opcoesAdicionais) {
        if (opcao.id) {
          // Atualizar opções adicionais existentes
          await prismaClient.opcaoAdicional.update({
            where: { id: opcao.id },
            data: {
              nome: opcao.nome,
              usoMensal: opcao.usoMensal,
            },
          })
        } else {
          // Criar novas opções adicionais se não tiver ID
          await prismaClient.opcaoAdicional.create({
            data: {
              servico: {
                connect: {
                  id: updatedProduct.id,
                },
              },
              nome: opcao.nome,
              usoMensal: opcao.usoMensal,
            },
          })
        }
      }
    }

    return updatedProduct
  }
}

export { UpdateProductService }
