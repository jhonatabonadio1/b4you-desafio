/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { CreateUserService } from '../../../services/common/users/CreateUserService'
import { prismaClient } from '../../../database/prismaClient'

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { email, password, firstName, lastName, empresa } = request.body

    const verificaEmailBlacklist = await prismaClient.blacklist.findFirst({
      where: { OR: [{ email }, { empresa }] },
    })

    if (verificaEmailBlacklist) {
      return response
        .status(401)
        .json({ error: 'Usuário bloqueado no sistema.' })
    }

    const createUserService = new CreateUserService()

    try {
      const user = await createUserService.execute({
        email,
        password,
        firstName,
        lastName,
        empresa,
      })
      return response.status(201).json(user)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { CreateUserController }
