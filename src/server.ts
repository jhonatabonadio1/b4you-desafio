import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/routes'

import helmet from 'helmet'

const app = express()

dotenv.config()

app.use(cors())
app.use(helmet())

const PORT = process.env.PORT || 3333

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', authRoutes)

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        error: err.message,
      })
    } else {
      next()
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    })
  },
)

app.listen(PORT, () => console.log('Servidor iniciado.'))
