import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log('Servidor iniciado.'))
