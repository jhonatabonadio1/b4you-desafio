import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Receber o token
  const authToken = request.headers.authorization

  // Validar se token está preenchido
  if (!authToken) {
    return response.status(401).end()
  }

  const [, token] = authToken.split(' ')

  try {
    // Validar se token é válido
    const { sub } = verify(
      token,
      '44697ae110c97c0a7b0eba9568f9c0aa',
    ) as IPayload

    // Recuperar informações do usuário
    request.userId = sub

    return next()
  } catch (err) {
    return response.status(401).end()
  }
}
