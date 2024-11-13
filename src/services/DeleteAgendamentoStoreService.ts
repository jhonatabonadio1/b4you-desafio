import axios from 'axios'
import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  usuarioId: string
}

class DeleteAgendamentoStoreService {
  async execute({ id, usuarioId }: IRequest) {
    // Encontrar o agendamento
    const agendamento = await prismaClient.agendamento.findFirst({
      where: {
        id,
        prestador: { id: usuarioId },
        deleted: false,
      },
    })

    if (!agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário.')
    }

    const prestador = await prismaClient.prestador.findFirst({
      where: { id: usuarioId, deleted: false },
    })

    // Verificar se o agendamento foi validado
    const validacao = await prismaClient.validacaoAgendamento.findFirst({
      where: {
        agendamentoId: id,
      },
    })

    // Se o agendamento foi validado, não pode ser cancelado
    if (validacao) {
      throw new Error(
        'Este agendamento já foi validado e não pode ser cancelado.',
      )
    }

    const deleteAgendamento = await prismaClient.agendamento.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        ativo: false,
      },
    })

    async function sendNotification() {
      await axios
        .post(
          'https://api.onesignal.com/notifications',
          {
            app_id: process.env.ONESIGNAL_APP_ID!,
            name: 'Cancelamento',
            target_channel: 'push',
            headings: {
              en: 'Seu agendamento foi cancelado',
            },
            include_aliases: { external_id: [agendamento?.usuarioId] },
            contents: {
              en:
                'Seu agendamento com ' +
                prestador?.razaoSocial +
                ' foi cancelado. Entre no app para agendar novamente!',
            },
          },
          {
            headers: {
              Authorization: process.env.ONESIGNAL_API_KEY!,
            },
          },
        )
        .then((data) => {
          console.log(data)
        })
        .catch(({ response }) => {
          console.log(response)
        })
    }

    if (deleteAgendamento) {
      sendNotification()
    }

    return deleteAgendamento
  }
}

export { DeleteAgendamentoStoreService }
