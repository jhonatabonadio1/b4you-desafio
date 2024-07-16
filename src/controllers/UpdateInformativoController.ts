import { Request, Response } from 'express'
import { UpdateInformativoService } from '../services/UpdateInformativoService'

class UpdateInformativoController {
  async handle(request: Request, response: Response) {
    const { titulo, texto, bannerUrl, url, html } = request.body
    const { id } = request.params

    const updateInformativoService = new UpdateInformativoService()

    const informativo = await updateInformativoService.execute({
      id,
      titulo,
      texto,
      bannerUrl,
      url,
      html,
    })

    return response.json(informativo)
  }
}

export { UpdateInformativoController }
