import { prismaClient } from '../../../database/prismaClient'
import { startOfDay, endOfDay } from 'date-fns'

import fs from 'fs'
import path from 'path'

class MonitorHealthService {
  async execute() {
    const health = {
      status: 'OK',
      uptime: process.uptime() + ' segundos',
      currentDate: new Date().toLocaleString(),
      memoryUsage: process.memoryUsage().heapUsed + ' bytes',
      version: process.version,
    }

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const logFolder = path.resolve(`logs/${yyyy}-${mm}-${dd}`)
    const logFilePath = path.join(logFolder, 'app.log')

    let logs = []
    try {
      if (fs.existsSync(logFilePath)) {
        const logData = await fs.promises.readFile(logFilePath, 'utf8')
        logs = logData
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((line) => {
            try {
              return JSON.parse(line)
            } catch (error) {
              return { message: line }
            }
          })
      } else {
        logs = [{ message: `Arquivo de log não encontrado em ${logFilePath}` }]
      }
    } catch (error: any) {
      logs = [{ message: `Erro ao ler logs: ${error.message}` }]
    }

    const start = startOfDay(today)
    const end = endOfDay(today)

    const users = await prismaClient.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        deleted: false,
      },
    })

    const campaings = await prismaClient.campaing.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        deleted: false,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    return { health, logs, users, campaings }
  }
}

export { MonitorHealthService }
