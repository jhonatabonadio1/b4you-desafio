import { prismaClient } from '../../../database/prismaClient'

class FetchUserStorageService {
  private userStorageLimit = 50 * 1024 * 1024

  async execute(userId: string) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.')
    }

    // 🔹 Busca os arquivos do usuário e soma os tamanhos
    const userFiles = await prismaClient.document.findMany({
      where: { userId },
      select: { sizeInBytes: true },
    })

    // 🔹 Calcula o total utilizado
    const totalUsed = userFiles.reduce((sum, file) => sum + file.sizeInBytes, 0)

    // 🔹 Calcula o espaço disponível
    const availableStorage = this.userStorageLimit - totalUsed

    return {
      totalUsed,
      availableStorage,
      totalLimit: this.userStorageLimit,
    }
  }
}

export { FetchUserStorageService }
