import cron from 'node-cron'
import { prismaClient } from '../database/prismaClient'
import moment from 'moment-timezone'

async function desativarAgendamentosVencidos() {
  const umMesAtras = moment.tz('America/Sao_Paulo').subtract(1, 'day').toDate()

  try {
    const result = await prismaClient.agendamento.updateMany({
      where: {
        deleted: false,
        ativo: true,
        data: {
          lt: umMesAtras,
        },
      },
      data: {
        ativo: false,
      },
    })

    console.log(`Agendamentos desativados: ${result.count}`)
  } catch (error) {
    console.error('Erro ao desativar agendamentos:', error)
  }
}

async function reexecutarJobsPerdidos() {
  const umMesAtras = moment
    .tz('America/Sao_Paulo')
    .subtract(1, 'month')
    .toDate()

  try {
    const agendamentosPerdidos = await prismaClient.agendamento.findMany({
      where: {
        deleted: false,
        ativo: true,
        data: {
          lt: umMesAtras,
        },
      },
    })

    if (agendamentosPerdidos.length > 0) {
      console.log(
        `Reexecutando jobs perdidos para ${agendamentosPerdidos.length} agendamentos.`,
      )
      await desativarAgendamentosVencidos()
    }
  } catch (error) {
    console.error('Erro ao reexecutar jobs perdidos:', error)
  }
}

// Agendando o cronjob para rodar todos os dias à meia-noite
cron.schedule(
  '0 0 * * *',
  () => {
    console.log('Executando tarefa de desativação de agendamentos vencidos')
    desativarAgendamentosVencidos()
  },
  {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
  },
)

reexecutarJobsPerdidos()
