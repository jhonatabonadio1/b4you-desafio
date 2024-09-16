import { Request, Response } from 'express'

import { ReadQrCodeService } from '../services/ReadQrCodeService'

class ReadQrCodeController {
  async handle(request: Request, response: Response) {
    const readQrCode = new ReadQrCodeService()
    const { data } = request.query
    const { userId } = request

    const qrCode = await readQrCode.execute({ data: data as string, userId })

    return response.json(qrCode)
  }
}

export { ReadQrCodeController }
