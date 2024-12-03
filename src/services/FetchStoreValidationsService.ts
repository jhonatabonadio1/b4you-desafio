import { prismaClient } from '../database/prismaClient'

type IData = {
  storeId: string
}

class FetchStoreValidationsService {
  async execute({ storeId }: IData) {
    const findUser = await prismaClient.prestador.findFirst({
      where: { id: storeId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Prestador não encontrado')
    }

    const findAgendamnetos = await prismaClient.validacaoAgendamento.findMany({
      where: { prestador: { id: findUser.id } },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        usuario: true,
        agendamento: {
          select: {
            data: true,
            ativo: true,
            servico: true,
            veiculo: true,
            opcoesAdicionais: true,
          },
        },
      },
    })

    const findBrindes = await prismaClient.validacaoBrinde.findMany({
      where: { prestador: { id: findUser.id } },
      include: {
        usuario: true,
        brinde: true,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agendamentosValidados = [] as any

    for (const agendamento of findAgendamnetos) {
      const resposta = {
        id: agendamento.id,
        nome: agendamento.agendamento.servico.nome,
        data: agendamento.agendamento.data,
        ativo: agendamento.agendamento.ativo,
        tipo: 'booking',
        usuario: {
          id: agendamento.usuario.id,
          nome: agendamento.usuario.nome,
          email: agendamento.usuario.email,
          phone: agendamento.usuario.phone,
        },
        opcoesAdicionais: JSON.parse(agendamento.agendamento.opcoesAdicionais),
        veiculo: agendamento.agendamento.veiculo,
        dataValidacao: agendamento.created_at,
      }
      agendamentosValidados.push(resposta)
    }

    for (const brinde of findBrindes) {
      const resposta = {
        id: brinde.id,
        nome: brinde.brinde.nome,
        data: brinde.brinde.data,
        ativo: brinde.brinde.ativo,
        tipo: 'brinde',
        usuario: {
          id: brinde.usuario.id,
          nome: brinde.usuario.nome,
          email: brinde.usuario.email,
          phone: brinde.usuario.phone,
        },
        opcoesAdicionais: [], // Brindes geralmente não têm opções adicionais, mas pode ser ajustado conforme necessário
        veiculo: null,
        dataValidacao: brinde.created_at,
      }
      agendamentosValidados.push(resposta)
    }

    return agendamentosValidados
  }
}

export { FetchStoreValidationsService }
