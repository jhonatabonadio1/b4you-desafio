import axios from 'axios'
import { prismaClient } from '../database/prismaClient'
import { isBefore, subHours, addMinutes, parseISO, format } from 'date-fns'

interface IRequest {
  id: string
  usuarioId: string
}

class DeleteAgendamentoUserService {
  async execute({ id, usuarioId }: IRequest) {
    // Encontrar o agendamento
    const agendamento = await prismaClient.agendamento.findFirst({
      where: {
        id,
        usuarioId,
        deleted: false,
      },
    })

    if (!agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário.')
    }

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

    if (agendamento.data) {
      const dataAgendamento = new Date(agendamento.data)
      const umaHoraAntes = subHours(dataAgendamento, 1)
      const trintaMinutosDepois = addMinutes(dataAgendamento, 30)
      const agora = new Date()

      // Permitir o cancelamento até 1 hora antes do agendamento
      // ou após 30 minutos do horário do agendamento
      if (
        isBefore(agora, umaHoraAntes) ||
        isBefore(trintaMinutosDepois, agora)
      ) {
        // Se passar nas verificações, cancelar o agendamento
        const deleteAgendamento = await prismaClient.agendamento.update({
          where: {
            id,
          },
          data: {
            deleted: true,
            ativo: false,
          },
        })

        const dataString = new Date(agendamento.data).toISOString()

        const dataAgendamentoFormatada = format(
          parseISO(dataString),
          "dd/MM/yyyy 'às' HH:mm",
        )

        async function sendNotification() {
          await axios.post(
            'https://api.onesignal.com/notifications',
            {
              app_id: process.env.ONESIGNAL_APP_ID!,
              name: 'Cancelamento',
              target_channel: 'push',
              headings: {
                en: 'Agendamento cancelado',
              },
              include_aliases: { external_id: [agendamento?.prestadorId] },
              contents: {
                en:
                  'O agendamento do dia ' +
                  dataAgendamentoFormatada +
                  ' foi cancelado.',
              },
            },
            {
              headers: {
                Authorization: process.env.ONESIGNAL_API_KEY!,
              },
            },
          )
        }

        if (deleteAgendamento) {
          sendNotification()
        }

        return deleteAgendamento
      }

      throw new Error(
        'Você só pode cancelar até 1 hora antes do agendamento ou após 30 minutos do horário marcado.',
      )
    }
  }
}

export { DeleteAgendamentoUserService }
