import { prismaClient } from '../../../database/prismaClient'

class SaveEnvioService {
  async execute(data: {
    phoneNumber: string
    imovelId: string
    clientId: string
    message: string
    userId: string
  }) {
    const { phoneNumber, imovelId, clientId, message, userId } = data

    if (!phoneNumber || !message || !userId) {
      throw new Error('Todos os campos são obrigatórios.')
    }

    // Salva o envio no banco de dados
    const envio = await prismaClient.envios.create({
      data: {
        phoneNumber,
        imovelId,
        v: 0,
        clientId,
        message,
        user: userId,
      },
    })

    return envio
  }
}

export { SaveEnvioService }
