import { prismaClient } from '../database/prismaClient'

type IProduto = {
  produtoId: string
}

// Exclude keys from user
function exclude<Prestador, Key extends keyof Prestador>(
  user: Prestador,
  keys: Key[],
): Omit<Prestador, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class FetchProductPrestadoresService {
  async execute({ produtoId }: IProduto) {
    const findProducts = await prismaClient.servico.findFirst({
      where: { id: produtoId, deleted: false },
    })

    const prestadores = []

    if (findProducts) {
      for (const prestadorId of findProducts.prestadores) {
        const buscaPrestador = await prismaClient.prestador.findFirst({
          where: { id: prestadorId, deleted: false, ativo: true },
        })
        if (buscaPrestador) {
          prestadores.push(
            exclude(buscaPrestador, [
              'password',
              'deleted',
              'inscricao',
              'tipoInscricao',
              'email',
            ]),
          )
        }
      }
    }

    return prestadores
  }
}

export { FetchProductPrestadoresService }
