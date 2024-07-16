import { prismaClient } from '../database/prismaClient'
import moment from 'moment-timezone'

interface IUser {
  userId: string
}

// Função exclude ajustada para aceitar arrays de objetos
function excludeArray<Brinde, Key extends keyof Brinde>(
  brindes: Brinde[],
  keys: Key[],
): Omit<Brinde, Key>[] {
  return brindes.map((brinde) => {
    const brindeCopy = { ...brinde }
    keys.forEach((key) => delete brindeCopy[key])
    return brindeCopy
  })
}

class FetchUsuarioBrindesService {
  async execute({ userId }: IUser) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        id: userId,
        deleted: false,
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

    const usuariosBrindes = []

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

    const usuariosBrindeEx = excludeArray(buscaBrindes, [
      'prestadoresEspecificos',
      'usuariosEspecificos',
      'todosUsuarios',
      'todosPrestadores',
      'dataDisponibilidade',
      'deleted',
      'ativo',
      'created_at',
    ])

    return usuariosBrindeEx
  }
}

export { FetchUsuarioBrindesService }
