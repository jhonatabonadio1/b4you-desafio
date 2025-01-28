import { Request, Response } from 'express'
import { SaveEnvioService } from '../../../services/common/envios/SaveEnvioService'

class SaveEnvioController {
  async handle(request: Request, response: Response) {
    const { userId } = request // Obtido do middleware de autenticação
    const { phoneNumber, imovelId, clientId, message } = request.body

    try {
      const saveEnvioService = new SaveEnvioService()

      const envio = await saveEnvioService.execute({
        phoneNumber,
        imovelId,
        clientId,
        message,
        userId,
      })

      return response
        .status(201)
        .json({ message: 'Envio salvo com sucesso', envio })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { SaveEnvioController }
