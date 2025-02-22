import { Request, Response, NextFunction } from 'express'

import { prismaClient } from '../database/prismaClient'

export async function userInBlacklist(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { userId, ip } = request

  try {
    const buscaUsuario = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    })

    console.log(ip)

    const blacklistCheck = await prismaClient.blacklist.count({
      where: {
        OR: [
          {
            ip,
          },
          {
            userId,
          },
          {
            email: buscaUsuario?.email,
          },
          {
            empresa: buscaUsuario?.empresa,
          },
        ],
      },
    })

    console.log(blacklistCheck)

    if (blacklistCheck > 0) {
      return response.status(401).end()
    } else {
      return next()
    }
  } catch (err) {
    return response.status(401).end()
  }
}
