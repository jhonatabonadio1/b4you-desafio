import { prismaClient } from '../database/prismaClient'

interface IQrCode {
  data: string
  userId: string
  clientCode: string
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
      type: match[1], // 'brinde' ou 'booking'
      id: match[2], // ID extraído
      userId: match[3], // user ID extraído
    } as Data
  } else {
    return null // Retorna null se não encontrar uma correspondência
  }
}

class ValidaQrCodeService {
  async execute({ data, clientCode, userId }: IQrCode) {
    const dataExtracted = extractIdsFromString(data)

    const findPrestador = await prismaClient.prestador.findFirst({
      where: { id: userId, deleted: false },
    })

    if (!findPrestador) {
      throw new Error('Prestador não encontrado.')
    }

    if (!dataExtracted) {
      throw new Error('QRCode inválido')
    }

    const findUser = await prismaClient.usuario.findFirst({
      where: { id: dataExtracted.userId, deleted: false },
    })

    if (!findUser) {
      throw new Error('Usuário não encontrado')
    }

    if (dataExtracted.type === 'booking') {
      const agendamento = await prismaClient.agendamento.findUnique({
        where: { id: dataExtracted.id, deleted: false },
        include: { prestador: true, validacao_agendamento: true },
      })

      if (!agendamento) {
        throw new Error('Agendamento não econtrado.')
      }

      if (!agendamento.ativo) {
        throw new Error('Agendamento não está ativo.')
      }

      if (agendamento.validacao_agendamento.length > 0) {
        throw new Error('Agendamento já foi validado.')
      }

      if (agendamento.prestadorId !== findPrestador.id) {
        throw new Error('Prestador não autorizado.')
      }

      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      if (agendamento.data < oneMonthAgo) {
        throw new Error(
          'Agendamento não pode ser validado após 1 mês da data agendada.',
        )
      }

      const codCliente = findUser.cpf.substring(0, 4)

      console.log(codCliente)

      if (clientCode !== codCliente) {
        throw new Error('Código do cliente inválido.')
      }

      await prismaClient.validacaoAgendamento.create({
        data: {
          agendamentoId: agendamento.id,
          usuarioId: dataExtracted.userId,
          prestadorId: findPrestador.id,
        },
      })

      await prismaClient.agendamento.update({
        where: { id: dataExtracted.id, deleted: false },
        data: {
          ativo: false,
        },
      })

      return { success: true, message: 'Agendamento validado com sucesso.' }
    } else if (dataExtracted.type === 'brinde') {
      const brinde = await prismaClient.brinde.findUnique({
        where: { id: dataExtracted.id, deleted: false },
        include: { validacao_brinde: true },
      })

      if (!brinde) {
        throw new Error('Brinde não encontrado.')
      }

      if (!brinde.ativo) {
        throw new Error('Brinde não está ativo.')
      }

      const brindeValidated = await prismaClient.validacaoBrinde.findFirst({
        where: {
          brindeId: brinde.id,
          usuarioId: dataExtracted.userId,
        },
      })

      if (brindeValidated) {
        throw new Error('Brinde já validado para o usuário')
      }

      if (brinde.dataLimite && new Date(brinde.dataLimite) < new Date()) {
        throw new Error('Brinde fora da validade.')
      }

      if (
        !brinde.todosUsuarios &&
        !brinde.usuariosEspecificos.includes(findPrestador.id)
      ) {
        throw new Error('Usuário não permitido para validação do brinde.')
      }

      if (
        !brinde.todosPrestadores &&
        !brinde.prestadoresEspecificos.includes(findPrestador.id)
      ) {
        throw new Error('Prestador não permitido para validação do brinde')
      }

      const codCliente = findUser.cpf.substring(0, 4)

      if (clientCode !== codCliente) {
        throw new Error('Código do cliente inválido.')
      }

      await prismaClient.validacaoBrinde.create({
        data: {
          brindeId: brinde.id,
          usuarioId: dataExtracted.userId,
          prestadorId: findPrestador.id,
        },
      })

      await prismaClient.brinde.update({
        where: { id: brinde.id, deleted: false },
        data: {
          ativo: false,
        },
      })

      return { success: true, message: 'Brinde validado com sucesso.' }
    }

    throw new Error('Dados inválidos.')
  }
}

export { ValidaQrCodeService }
