import { prismaClient } from '../database/prismaClient'

interface IUser {
  id: string
}

class FetchBrindeService {
  async execute({ id }: IUser) {
    const brinde = await prismaClient.brinde.findFirst({
      where: {
        id,
      },
    })

    if (!brinde) {
      throw new Error('Brinde não encontrado')
    }

    const prestadoresArray = []
    const usuariosArray = []

    if (!brinde.todosPrestadores) {
      const buscaPrestadores = brinde.prestadoresEspecificos

      for (const busca of buscaPrestadores) {
        const dadosPrestadores = await prismaClient.prestador.findFirst({
          where: {
            id: busca,
          },
        })

        if (dadosPrestadores) {
          prestadoresArray.push({
            label: dadosPrestadores.razaoSocial,
            value: dadosPrestadores.id,
          })
        }
      }
    }

    if (!brinde.todosUsuarios) {
      const buscaUsuarios = brinde.usuariosEspecificos

      for (const busca of buscaUsuarios) {
        const dadosUsuarios = await prismaClient.usuario.findFirst({
          where: {
            id: busca,
          },
        })

        if (dadosUsuarios) {
          usuariosArray.push({
            label: dadosUsuarios.nome,
            value: dadosUsuarios.id,
          })
        }
      }
    }

    return {
      ...brinde,
      prestadoresEspecificos: brinde.todosPrestadores ? [] : prestadoresArray,
      usuariosEspecificos: brinde.todosUsuarios ? [] : usuariosArray,
    }
  }
}

export { FetchBrindeService }
