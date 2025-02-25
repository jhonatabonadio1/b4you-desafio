import IORedis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

export const redisConnection = {
  connection: new IORedis(process.env.REDIS_URL!, {
    tls: {
      rejectUnauthorized: false, // Necessário para conexões seguras no Heroku
    },
    maxRetriesPerRequest: null,
  }),
}
