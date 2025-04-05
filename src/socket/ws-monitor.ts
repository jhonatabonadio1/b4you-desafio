// ws-monitor.ts
import http from 'http'
import WebSocket from 'ws'
import fs from 'fs'
import path from 'path'

import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { logger } from '../config/logger'

const server = http.createServer()

const wss = new WebSocket.Server({ server })

async function readLogs(): Promise<string[]> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const logFolder = path.resolve(`logs/${yyyy}-${mm}-${dd}`)
  const logFilePath = path.join(logFolder, 'app.log')

  let logs: string[] = []
  try {
    if (fs.existsSync(logFilePath)) {
      const logData = await fs.promises.readFile(logFilePath, 'utf8')
      logs = logData.split('\n').filter((line) => line.trim() !== '')
    } else {
      logs.push(`Arquivo de log não encontrado em ${logFilePath}`)
    }
  } catch (error: any) {
    logs.push(`Erro ao ler logs: ${error.message}`)
  }
  return logs
}

wss.on('connection', (ws) => {
  console.log('Cliente conectado via WebSocket para monitoramento.')
  const prismaClient = new PrismaClient()

  const sendStatus = async () => {
    let dbStatus = 'OK'
    try {
      await prismaClient.user.findMany()
    } catch (error: any) {
      logger.error(error.message)
      dbStatus = 'DOWN'
    }

    const logs = await readLogs()

    let successCount = 0
    let errorCount = 0
    for (const logLine of logs) {
      try {
        const logObj = JSON.parse(logLine)
        if (logObj.level) {
          const level = logObj.level.toLowerCase()
          if (level === 'success') successCount++
          if (level === 'error') errorCount++
        }
      } catch (err) {}
    }

    const health = {
      uptime: (process.uptime() / 60).toFixed(2) + ' minutos',
      memoryUsage:
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      currentDate: new Date().toLocaleString(),
      dbConnection: dbStatus,
      transactions: {
        success: successCount,
        errors: errorCount,
      },
    }

    const payload = {
      type: 'monitor-update',
      data: {
        health,
        logs,
      },
    }

    ws.send(JSON.stringify(payload))
  }

  sendStatus()

  const intervalId = setInterval(sendStatus, 5000)

  ws.on('close', () => {
    console.log('Cliente desconectado do monitoramento.')
    clearInterval(intervalId)
  })

  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error)
  })
})

const PORT_WS = 3001
server.listen(PORT_WS, () => {
  console.log(`Servidor WebSocket de monitoramento rodando na porta ${PORT_WS}`)
})
