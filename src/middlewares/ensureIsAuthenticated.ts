import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { verify } = jwt

  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).end()
  }

  const [, token] = authToken.split(' ')

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload

    request.userId = sub

    return next()
  } catch (err) {
    return response.status(401).end()
  }
}
