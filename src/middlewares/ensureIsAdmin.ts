import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { prismaClient } from '../database/prismaClient'

interface IPayload {
  sub: string
}

export async function ensureIsAdmin(
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
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload

    // Recuperar informações do usuário
    request.userId = sub

    const buscaUsuario = await prismaClient.users.findFirst({
      where: {
        id: sub,
      },
    })

    if (!buscaUsuario) {
      return response.status(404).end()
    }

    if (buscaUsuario.role !== 'admin') {
      return response.status(401).end()
    }

    return next()
  } catch (err) {
    return response.status(401).end()
  }
}
