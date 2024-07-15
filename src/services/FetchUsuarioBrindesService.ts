import { Brinde } from '@prisma/client'
import { prismaClient } from '../database/prismaClient'
import moment from 'moment-timezone'

interface IUser {
  userId: string
}

class FetchUsuarioBrindesService {
  async execute({ userId }: IUser) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const agoraBrasil = moment.tz('America/Sao_Paulo')
    const hojeBrasilStr = agoraBrasil.format('YYYY-MM-DD')

    const buscaBrindes = await prismaClient.brinde.findMany({
      where: {
        deleted: false,
        ativo: true,
        OR: [
          {
            dataLimite: null,
          },
          {
            dataLimite: {
              gte: new Date(`${hojeBrasilStr}T00:00:00.000Z`),
            },
          },
        ],
      },
    })

    const usuariosBrindes = [] as Brinde[]

    for (const brinde of buscaBrindes) {
      if (!brinde.todosUsuarios) {
        const buscaUsuarioBrindes = brinde.usuariosEspecificos.find(
          (item) => item === userId,
        )

        if (buscaUsuarioBrindes) {
          usuariosBrindes.push(brinde)
        }
      } else {
        usuariosBrindes.push(brinde)
      }
    }

    return usuariosBrindes
  }
}

export { FetchUsuarioBrindesService }
