/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'

import { routes } from './routes/routes'
import bodyParser from 'body-parser'

import fs from 'fs'
import path from 'path'

dotenv.config()

const PORT = process.env.PORT || 3333

const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://127.0.0.1:3000',
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    'Muitas requisições feitas a partir deste IP, tente novamente mais tarde.',
})

app.use(limiter)

app.use(bodyParser.raw())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

app.get('/health', (req, res) => {
  const logFilePath = path.resolve('app.log')
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler os logs.')
    }
    res.type('text/plain').send(data)
  })
})

app.listen(PORT, () => console.log(`🔥 Servidor iniciado na porta ${PORT}`))
