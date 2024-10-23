import { Request, Response } from 'express'
import { CreateInformativoService } from '../services/CreateInformativoService'

class CreateInformativoController {
  async handle(request: Request, response: Response) {
    const { file } = request
    const { titulo, texto, url, html } = request.body

    const createInformativoService = new CreateInformativoService()

    const informativo = await createInformativoService.execute({
      titulo,
      texto,
      fileName: file?.filename,
      filePath: file?.path,
      url,
      html,
    })

    return response.json(informativo)
  }
}

export { CreateInformativoController }
