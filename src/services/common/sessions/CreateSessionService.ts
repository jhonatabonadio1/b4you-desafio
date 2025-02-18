import { prismaClient } from '../../../database/prismaClient'

interface ICreateSessionRequest {
  docId: string
  network: string
  fingerprint: string
}

class CreateSessionService {
  async execute({ docId, network, fingerprint }: ICreateSessionRequest) {
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!fingerprint || !docId) {
      throw new Error('Preencha os campos obrigatórios.')
    }

    // Obtém a última sessão registrada para esse fingerprint e network
    const lastSession = await prismaClient.session.findFirst({
      where: { fingerprint, network },
      orderBy: { createdAt: 'desc' }, // Ordena pela mais recente
    })

    if (lastSession) {
      // Calcula a diferença de tempo entre agora e a última sessão
      const FIVE_MINUTES = 5 * 60 * 1000 // 5 minutos em milissegundos
      const lastSessionTime = new Date(lastSession.createdAt).getTime()
      const now = Date.now()

      if (now - lastSessionTime < FIVE_MINUTES) {
        // Se a última sessão ainda estiver válida, retorna a existente
        return {
          sessionId: lastSession.id,
        }
      }
    }

    // Cria a nova sessão, pois já passou o tempo mínimo
    const session = await prismaClient.session.create({
      data: { docId, fingerprint, network },
    })

    return {
      sessionId: session.id,
    }
  }
}

export { CreateSessionService }
