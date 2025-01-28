import { prismaClient } from '../../../database/prismaClient'

class CreateFonteService {
  async execute(nome: string) {
    if (!nome) {
      throw new Error('O nome da fonte é obrigatório.')
    }

    const fonteExistente = await prismaClient.fontes.findFirst({
      where: { nome },
    })

    if (fonteExistente) {
      throw new Error('Fonte já cadastrada.')
    }

    const fonte = await prismaClient.fontes.create({
      data: { nome, v: 0 },
    })

    return fonte
  }
}

export { CreateFonteService }
