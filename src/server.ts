/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { authRoutes } from './routes/routes'
import { sanitizeResponse } from './middlewares/removePassword'
import { defender } from './middlewares/xssDefender'

import csrfMiddleware from './middlewares/csrf'
import { secret, tokens } from './lib/csfrSecret'

dotenv.config()

const PORT = process.env.PORT || 3333
const app = express()

// 🚀 Proteção contra força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
})

// 🚀 Proteção contra ataques DDoS
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Começa a aplicar delay após 50 requisições
  delayMs: () => 500, // Adiciona 500ms de delay fixo por requisição após `delayAfter`
})

// 🚀 Middlewares essenciais
const allowedOriginsProd = ['https://app.ymobis.com']
const allowedOriginsDev = ['http://localhost:3000']

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

// 🚀 Proteção contra força bruta e DDoS
app.use(limiter)
app.use(speedLimiter)

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
app.use('/api', authRoutes)

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
