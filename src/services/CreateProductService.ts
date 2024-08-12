import { prismaClient } from '../database/prismaClient'

interface IRequest {
  nome: string
  imageUrl: string
  prestadores: string[]
  datasDisponiveis: string[]
  preco: number
  precoCarroGrande?: number
  precoCarroPequeno?: number
  ativo: boolean
  opcoesAdicionais: {
    nome: string
    value: number
  }[]
  exigeVeiculo: boolean
}

class CreateProductService {
  async execute({
    nome,
    imageUrl,
    prestadores,
    datasDisponiveis,
    preco,
    precoCarroGrande,
    precoCarroPequeno,
    ativo,
    opcoesAdicionais,
    exigeVeiculo,
  }: IRequest) {
    if (!nome) {
      throw new Error('Nome é obrigatório')
    }

    if (prestadores.length === 0) {
      throw new Error('Selecione ao menos 1 prestador')
    }

    if (datasDisponiveis.length === 0) {
      throw new Error('Selecione ao menos 1 data')
    }

    if (!preco) {
      throw new Error('Preço é obrigatório')
    }

    const precoCents = preco * 100
    const precoCarroGrandeCents = precoCarroGrande ? precoCarroGrande * 100 : 0
    const precoCarroPequenoCents = precoCarroPequeno
      ? precoCarroPequeno * 100
      : 0

    const product = await prismaClient.servico.create({
      data: {
        nome,
        imageUrl,
        prestadores,
        datasDisponiveis,
        preco: precoCents,
        precoCarroGrande: precoCarroGrandeCents,
        precoCarroPequeno: precoCarroPequenoCents,
        exigeVeiculo,
        ativo,
        created_at: new Date(),
      },
      include: {
        opcoesAdicionais: true,
      },
    })

    if (opcoesAdicionais.length > 0) {
      for (const opcao of opcoesAdicionais) {
        const valueCents = opcao.value * 100
        await prismaClient.opcaoAdicional.create({
          data: {
            servico: {
              connect: {
                id: product.id,
              },
            },
            nome: opcao.nome,
            value: valueCents,
          },
        })
      }
    }

    return product
  }
}

export { CreateProductService }
