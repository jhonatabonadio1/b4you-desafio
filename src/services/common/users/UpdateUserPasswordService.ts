import { hash } from 'bcryptjs'
import { prismaClient } from '../../../database/prismaClient'

interface IUpdateUserRequest {
  requestId: string
  password: string
}

class UpdateUserPasswordService {
  async execute({ requestId, password }: IUpdateUserRequest) {
    if (!requestId) {
      throw new Error('Request ID inválida.')
    }

    const findRequest = await prismaClient.recoveryRequests.findFirst({
      where: {
        id: requestId,
        valid: true,
      },
      include: {
        user: true,
      },
    })

    if (!findRequest) {
      throw new Error('Request ID inválida.')
    }

    if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,})/.test(password)) {
      throw new Error(
        'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.',
      )
    }

    const currentTime = new Date()
    if (findRequest.expiresAt && findRequest.expiresAt < currentTime) {
      await prismaClient.recoveryRequests.update({
        where: { id: requestId },
        data: { valid: false },
      })
      throw new Error('O link de recuperação expirou.')
    }

    const isSamePassword =
      (await hash(password, 12)) === findRequest.user.password
    if (isSamePassword) {
      throw new Error('A nova senha não pode ser igual à senha antiga.')
    }

    const hashPassword = await hash(password, 12)

    const user = await prismaClient.user.update({
      where: { id: findRequest.userId },
      data: {
        password: hashPassword,
      },
    })

    await prismaClient.recoveryRequests.update({
      where: { id: findRequest.id },
      data: { valid: false },
    })

    return user
  }
}

export { UpdateUserPasswordService }
