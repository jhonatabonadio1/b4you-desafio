import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'logs/%DATE%/app.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})
