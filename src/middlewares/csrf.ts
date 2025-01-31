import { Request, Response, NextFunction } from 'express'

import { config } from 'dotenv'
import { secret, tokens } from '../lib/csfrSecret'

config()

const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      const csrfToken = req.header('X-CSRF-Token') as string

      if (!tokens.verify(secret, csrfToken)) {
        return res.status(403).json({ error: 'Invalid CSRF token' })
      }
    } catch {
      return res.status(403).json({ error: 'Invalid CSRF token' })
    }
  }

  next()
}

export default csrfMiddleware
