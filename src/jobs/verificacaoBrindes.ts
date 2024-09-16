import cron from 'node-cron'
import { prismaClient } from '../database/prismaClient'
import moment from 'moment-timezone'

async function updateBrindesAtivos() {
  const agoraBrasil = moment.tz('America/Sao_Paulo')
  const hojeBrasilStr = agoraBrasil.format('YYYY-MM-DD')

  try {
    const result = await prismaClient.brinde.updateMany({
      where: {
        deleted: false,
        dataDisponibilidade: {
          gte: new Date(`${hojeBrasilStr}T00:00:00.000Z`),
          lt: new Date(`${hojeBrasilStr}T23:59:59.999Z`),
        },
        ativo: false,
      },
      data: {
        ativo: true,
      },
    })

    console.log(`Brindes atualizados: ${result.count}`)
  } catch (error) {
    console.error('Erro ao atualizar brindes:', error)
  }
}

async function reexecutarJobsPerdidos() {
  const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD')

  try {
    const brindesPerdidos = await prismaClient.brinde.findMany({
      where: {
        deleted: false,
        dataDisponibilidade: {
          lte: new Date(`${hoje}T23:59:59.999Z`),
        },
        ativo: false,
      },
    })

    if (brindesPerdidos.length > 0) {
      console.log(
        `Reexecutando jobs perdidos para ${brindesPerdidos.length} brindes.`,
      )
      await updateBrindesAtivos()
    }
  } catch (error) {
    console.error('Erro ao reexecutar jobs perdidos:', error)
  }
}

cron.schedule(
  '0 0 * * *',
  () => {
    console.log('Executando tarefa de atualização de brindes')
    updateBrindesAtivos()
  },
  {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
  },
)

reexecutarJobsPerdidos()
