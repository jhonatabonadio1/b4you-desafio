import { prismaClient } from '../database/prismaClient'

function excludeArray<Informativo, Key extends keyof Informativo>(
  brindes: Informativo[],
  keys: Key[],
): Omit<Informativo, Key>[] {
  return brindes.map((brinde) => {
    const brindeCopy = { ...brinde }
    keys.forEach((key) => delete brindeCopy[key])
    return brindeCopy
  })
}

class FetchUsuarioInformativosService {
  async execute() {
    const informativos = await prismaClient.informativos.findMany({
      where: {
        deleted: false,
      },
    })

    return excludeArray(informativos, ['deleted', 'created_at'])
  }
}

export { FetchUsuarioInformativosService }
