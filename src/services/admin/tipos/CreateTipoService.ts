import { prismaClient } from '../../../database/prismaClient'

class CreateTipoService {
  async execute(nome: string) {
    if (!nome) {
      throw new Error('O nome do tipo é obrigatório.')
    }

    const tipoExistente = await prismaClient.tipos.findFirst({
      where: { nome },
    })

    if (tipoExistente) {
      throw new Error('Tipo já cadastrado.')
    }

    const tipo = await prismaClient.tipos.create({
      data: { v: 0, nome },
    })

    return tipo
  }
}

export { CreateTipoService }
