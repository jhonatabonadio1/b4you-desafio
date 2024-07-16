import { prismaClient } from '../database/prismaClient'

function excludeArray<Convenio, Key extends keyof Convenio>(
  brindes: Convenio[],
  keys: Key[],
): Omit<Convenio, Key>[] {
  return brindes.map((brinde) => {
    const brindeCopy = { ...brinde }
    keys.forEach((key) => delete brindeCopy[key])
    return brindeCopy
  })
}

class FetchUsuarioConveniosService {
  async execute() {
    const convenios = await prismaClient.convenios.findMany({
      where: {
        deleted: false,
      },
    })

    return excludeArray(convenios, ['deleted', 'created_at'])
  }
}

export { FetchUsuarioConveniosService }
