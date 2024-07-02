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
  // Receber o tokenwww
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

    const buscaUsuario = await prismaClient.usuario.findFirst({
      where: {
        id: sub,
      },
    })

    if (!buscaUsuario) {
      return response.status(404).end()
    }

    if (buscaUsuario.tipoAcesso !== 'admin') {
      return response.status(401).end()
    }

    return next()
  } catch (err) {
    return response.status(401).end()
  }
}
