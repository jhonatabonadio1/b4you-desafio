import { Request, Response } from 'express'
import { CreateInformativoService } from '../services/CreateInformativoService'

class CreateInformativoController {
  async handle(request: Request, response: Response) {
    const { titulo, texto, bannerUrl, url, html } = request.body

    const createInformativoService = new CreateInformativoService()

    const informativo = await createInformativoService.execute({
      titulo,
      texto,
      bannerUrl,
      url,
      html,
    })

    return response.json(informativo)
  }
}

export { CreateInformativoController }
