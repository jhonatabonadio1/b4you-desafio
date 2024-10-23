import { Request, Response } from 'express'
import { CreateConvenioService } from '../services/CreateConvenioService'

class CreateConvenioController {
  async handle(request: Request, response: Response) {
    const { file } = request // Arquivo processado pelo multer
    const { titulo, texto, url, html, categoria } = request.body

    const createConvenioService = new CreateConvenioService()

    const convenio = await createConvenioService.execute({
      titulo,
      texto,
      fileName: file?.filename,
      filePath: file?.path,
      url,
      html,
      categoria,
    })

    return response.json(convenio)
  }
}

export { CreateConvenioController }
