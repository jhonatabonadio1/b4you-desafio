import { Request, Response } from 'express'

import { ValidaQrCodeService } from '../services/ValidaQrCodeService'

class ValidaQrCodeController {
  async handle(request: Request, response: Response) {
    const validaQrCode = new ValidaQrCodeService()

    const { clientCode, data } = request.body
    const { userId } = request

    const qrCode = await validaQrCode.execute({
      data,
      userId,
      clientCode,
    })

    return response.json(qrCode)
  }
}

export { ValidaQrCodeController }
