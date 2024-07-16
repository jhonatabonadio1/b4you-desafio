import { Request, Response } from 'express'
import { UpdateConvenioService } from '../services/UpdateConvenioService'

class UpdateConvenioController {
  async handle(request: Request, response: Response) {
    const { titulo, texto, bannerUrl, url, html, categoria, ativo } =
      request.body
    const { id } = request.params

    const updateConvenioService = new UpdateConvenioService()

    const convenio = await updateConvenioService.execute({
      id,
      titulo,
      texto,
      bannerUrl,
      url,
      html,
      categoria,
      ativo,
    })

    return response.json(convenio)
  }
}

export { UpdateConvenioController }
