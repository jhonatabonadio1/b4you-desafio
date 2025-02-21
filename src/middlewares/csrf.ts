import { Request, Response, NextFunction } from 'express'

import { config } from 'dotenv'
import { secret, tokens } from '../lib/csfrSecret'

config()

const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const excludedRoutes = ['/api/stripe/webhook']

    // Verifica se a rota atual está na lista de exclusão
    if (excludedRoutes.includes(req.path)) {
      return next()
    }

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
