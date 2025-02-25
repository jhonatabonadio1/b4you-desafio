import { defaultApplicationRules } from '../../../config/DefaultApplicationRules'
import { prismaClient } from '../../../database/prismaClient'

class FetchUserStorageService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    let limiteStorage = defaultApplicationRules.storage.limit

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        userId,
        status: 'active',
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        plan: true,
      },
    })

    if (buscaInscricaoUsuário) {
      limiteStorage = buscaInscricaoUsuário.plan.limit
    }

    // 🔹 Busca os arquivos do usuário e soma os tamanhos
    const userFiles = await prismaClient.document.findMany({
      where: { userId },
      select: { sizeInBytes: true },
    })

    // 🔹 Calcula o total utilizado
    const totalUsed = userFiles.reduce(
      (sum, file) => sum + file.sizeInBytes / 100 / 100,
      0,
    )

    // 🔹 Calcula o espaço disponível
    const availableStorage = limiteStorage - totalUsed

    return {
      totalUsed,
      availableStorage,
      totalLimit: limiteStorage,
    }
  }
}

export { FetchUserStorageService }
