import { Request, Response } from 'express'
import { UpdateConvenioService } from '../services/UpdateConvenioService'

class UpdateConvenioController {
  async handle(request: Request, response: Response) {
    const { file } = request
    const { titulo, texto, url, html, categoria, ativo } = request.body
    const { id } = request.params

    const updateConvenioService = new UpdateConvenioService()

    const convenio = await updateConvenioService.execute({
      id,
      titulo,
      texto,
      fileName: file?.filename,
      filePath: file?.path,
      url,
      html,
      categoria,
      ativo,
    })

    return response.json(convenio)
  }
}

export { UpdateConvenioController }
