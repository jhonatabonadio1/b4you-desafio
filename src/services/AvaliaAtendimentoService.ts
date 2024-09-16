import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  userId: string
  estrelas: string
  mensagem: string
  bomAtendimento: boolean
  servicoCompleto: boolean
}

class AvaliaAtendimentoService {
  async execute({
    id,
    userId,
    estrelas,
    mensagem,
    bomAtendimento,
    servicoCompleto,
  }: IRequest) {
    const buscaAgendamneto = await prismaClient.validacaoAgendamento.findFirst({
      where: {
        id,
        usuario: {
          id: userId,
        },
        OR: [
          { avaliado: null },
          { avaliado: false },
          { avaliado: { equals: undefined } },
        ],
      },
    })

    if (!buscaAgendamneto) {
      throw new Error('Agendamento não encontrado/inválido.')
    }

    const realizaAvaliacao = await prismaClient.validacaoAgendamento.update({
      where: {
        id,
        usuario: {
          id: userId,
        },
        OR: [
          { avaliado: null },
          { avaliado: false },
          { avaliado: { equals: undefined } },
        ],
      },
      data: {
        avaliado: true,
        message: mensagem,
        bomAtendimento,
        servicoCompleto,
        dataAvaliacao: new Date(),
        estrelas: parseInt(estrelas),
      },
    })

    return realizaAvaliacao
  }
}

export { AvaliaAtendimentoService }
