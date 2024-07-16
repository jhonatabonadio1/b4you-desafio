import { Request, Response } from 'express'
import { CreateConvenioService } from '../services/CreateConvenioService'

class CreateConvenioController {
  async handle(request: Request, response: Response) {
    const { titulo, texto, bannerUrl, url, html, categoria } = request.body

    const createConvenioService = new CreateConvenioService()

    const convenio = await createConvenioService.execute({
      titulo,
      texto,
      bannerUrl,
      url,
      html,
      categoria,
    })

    return response.json(convenio)
  }
}

export { CreateConvenioController }
