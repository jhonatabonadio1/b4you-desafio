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

  // Receber o token
  const authToken = request.headers.authorization

  // Validar se token está preenchido
  if (!authToken) {
    return response.status(401).end()
  }

  const [, token] = authToken.split(' ')

  try {
    // Validar se token é válido
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload

    // Recuperar informações do usuário
    request.userId = sub

    return next()
  } catch (err) {
    return response.status(401).end()
  }
}
