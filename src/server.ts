/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import { sanitizeResponse } from './middlewares/removePassword'
import { defender } from './middlewares/xssDefender'

import csrfMiddleware from './middlewares/csrf'
import { secret, tokens } from './lib/csfrSecret'
import { routes } from './routes/routes'
import bodyParser from 'body-parser'

import WebSocket from 'ws'
import { CreatePageViewService } from './services/common/tracking/CreatePageViewService'

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws, req) => {
  const startTime = Date.now()
  console.log('📌 Rastreamento de 1 página conectado!')

  let sessionId = ''
  let fingerprint = ''
  let pageNumber = ''
  const network = req.socket.remoteAddress!

  const createPageView = new CreatePageViewService()

  // Recebendo mensagens do cliente
  ws.on('message', (message: any) => {
    try {
      const data = JSON.parse(message)
      console.log(data)
      if (data.sessionId) sessionId = data.sessionId
      if (data.fingerprint) fingerprint = data.fingerprint
      if (data.pageNumber) pageNumber = data.pageNumber
    } catch (error) {
      console.error('Erro ao processar mensagem do WebSocket:', error)
    }
  })

  // Quando o cliente fecha a conexão
  ws.on('close', async () => {
    const timeSpent = (Date.now() - startTime) / 1000 // Em segundos

    if (!sessionId) {
      console.warn(
        '⚠️ Nenhum sessionId recebido antes do fechamento da conexão.',
      )
      return
    }

    console.log(
      `❌ Conexão fechada! Salvando interação da sessão: ${sessionId}`,
    )
    console.log(
      `❌ Conexão fechada! Salvando interação da sessão: ${fingerprint}`,
    )
    console.log(`❌ Conexão fechada! Salvando interação da sessão: ${network}`)

    try {
      await createPageView.execute({
        fingerprint,
        sessionId,
        pageNumber: parseInt(pageNumber),
        interactionTime: timeSpent,
        network,
      })
    } catch (err) {
      console.log(err)
    }
  })
})

dotenv.config()

const PORT = process.env.PORT || 3333
const app = express()

app.use(bodyParser.raw())

/** const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
})**/

/** const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Começa a aplicar delay após 50 requisições
  delayMs: () => 500, // Adiciona 500ms de delay fixo por requisição após `delayAfter`
})**/

// 🚀 Middlewares essenciais
const allowedOriginsProd = ['https://app.ymobis.com']
const allowedOriginsDev = [
  'http://localhost:3000',
  'http://192.168.0.11:3000',
  'http://192.168.1.139:3000',
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        (process.env.ENV === 'DEV'
          ? allowedOriginsDev.includes(origin)
          : allowedOriginsProd.includes(origin))
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // 🔥 Permite cookies e autenticação
  }),
)

app.use(helmet())
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🚀 Proteção contra cache indevido
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Surrogate-Control', 'no-store')
  next()
})

// 🚀 Desativa ETag para evitar cache
app.disable('etag')

/**
app.use(limiter)
app.use(speedLimiter)
 */

// 🚀 Middleware para sanitizar entrada de usuários (Proteção contra XSS)
app.use(defender)

// 🚀 Middleware para remover senha das respostas
app.use(sanitizeResponse)
app.get('/api/csrf', (req, res) => {
  const token = tokens.create(secret)

  // ✅ Primeiro, define o cookie
  res.cookie('XSRF-TOKEN', token, { httpOnly: true })

  // ✅ Depois, retorna a resposta JSON
  return res.json({ csrfToken: token })
})

// 🚀 Middleware para processar cookies (necessário para CSRF)
app.use(csrfMiddleware)

// 📌 Rota para pegar o token CSRF manualmente (opcional)

// 🚀 Rotas protegidas (depois do CSRF!)
app.use('/api', routes)

// 🚀 Middleware de erro global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

// 🚀 Inicia o servidor
app.listen(PORT, () => console.log(`🔥 Servidor iniciado na porta ${PORT}`))
