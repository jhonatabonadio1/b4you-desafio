import { prismaClient } from '../database/prismaClient'

interface IQrCode {
  data: string
  userId: string
}

type Data = {
  type: 'booking' | 'brinde'
  id: string
  userId: string
}

function extractIdsFromString(inputString: string) {
  const regex = /(brinde|booking):([a-zA-Z0-9]+):user:([a-zA-Z0-9]+)/
  const match = regex.exec(inputString)

  if (match) {
    return {
      type: match[1],
      id: match[2],
      userId: match[3],
    } as Data
  } else {
    return null
  }
}

class ReadQrCodeService {
  async execute({ data, userId }: IQrCode) {
    const dataExtracted = extractIdsFromString(data)

    if (!dataExtracted) {
      throw new Error('Invalid QR Code format.')
    }

    let result = {}

    const findPrestador = await prismaClient.prestador.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findPrestador) {
      throw new Error('Prestador não encontrado.')
    }

    if (dataExtracted.type === 'booking') {
      const agendamento = await prismaClient.agendamento.findUnique({
        where: { id: dataExtracted.id, deleted: false },
        include: {
          prestador: true,
          usuario: true,
          servico: true,
        },
      })

      if (!agendamento) {
        throw new Error('Agendamento not found.')
      }

      const buscaAgendamentoJaValidado =
        await prismaClient.validacaoAgendamento.findFirst({
          where: {
            agendamentoId: agendamento.id,
          },
        })

      if (buscaAgendamentoJaValidado) {
        throw new Error('Agendamento já validado.')
      }

      if (agendamento.prestadorId !== findPrestador.id) {
        throw new Error('Prestador não autorizado')
      }

      if (!agendamento.ativo) {
        throw new Error('Esse agendamento está inativo.')
      }

      let dadosVeiculo

      if (agendamento.veiculoId) {
        dadosVeiculo = await prismaClient.veiculo.findFirst({
          where: { id: agendamento.veiculoId, deleted: false },
        })
      }

      result = {
        id: agendamento.id,
        nome: agendamento.servico.nome,
        data: agendamento.data,
        ativo: agendamento.ativo,
        tipo: 'booking',
        usuario: {
          id: agendamento.usuario.id,
          nome: agendamento.usuario.nome,
          email: agendamento.usuario.email,
          phone: agendamento.usuario.phone,
        },
        prestador: {
          id: agendamento.prestador.id,
          razaoSocial: agendamento.prestador.razaoSocial,
          email: agendamento.prestador.email,
          ativo: agendamento.prestador.ativo,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        opcoesAdicionais: JSON.parse(agendamento.opcoesAdicionais),
        veiculo: dadosVeiculo,
      }
    } else if (dataExtracted.type === 'brinde') {
      const brinde = await prismaClient.brinde.findUnique({
        where: { id: dataExtracted.id, deleted: false },
      })

      const findUser = await prismaClient.usuario.findFirst({
        where: { id: dataExtracted.userId, deleted: false },
      })

      if (!findUser) {
        throw new Error('Usuário não encontrado')
      }

      if (!brinde) {
        throw new Error('Brinde não encontrado')
      }

      const buscaBrindeJaValidado =
        await prismaClient.validacaoBrinde.findFirst({
          where: {
            brindeId: brinde.id,
            usuarioId: findUser.id,
          },
        })

      if (buscaBrindeJaValidado) {
        throw new Error('Brinde já validado.')
      }

      if (!brinde.ativo) {
        throw new Error('Brinde indisponíevl.')
      }

      if (!brinde.todosPrestadores) {
        const prestadoresBrinde = brinde.prestadoresEspecificos

        if (!brinde.prestadoresEspecificos) {
          throw new Error('Prestador não autorizado.')
        }

        const prestadorAuthorizedToValidate = prestadoresBrinde.find(
          (item) => item === findPrestador.id,
        )

        if (!prestadorAuthorizedToValidate) {
          throw new Error('Prestador não autorizado.')
        }
      }

      result = {
        id: brinde.id,
        nome: brinde.nome,
        data: brinde.dataDisponibilidade,
        ativo: brinde.ativo,
        tipo: 'brinde',
        usuario: {
          id: findUser.id,
          nome: findUser.nome,
          email: findUser.email,
          phone: findUser.phone,
        },
        prestador: {
          id: findPrestador.id,
          razaoSocial: findPrestador.razaoSocial,
          email: findPrestador.email,
          ativo: findPrestador.ativo,
        },
        opcoesAdicionais: [], // Brindes geralmente não têm opções adicionais, mas pode ser ajustado conforme necessário
        veiculo: null,
      }
    } else {
      throw new Error('Invalid QR Code type.')
    }

    return result
  }
}

export { ReadQrCodeService }
