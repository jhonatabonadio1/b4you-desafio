import { Request, Response } from 'express'
import { GetFileService } from '../../../services/common/files/GetFileService'

class GetFileController {
  async handle(req: Request, res: Response) {
    const { docId } = req.params

    if (!docId) {
      return res.status(400).json({ error: 'O ID do documento é obrigatório.' })
    }

    const getDocumentService = new GetFileService()

    try {
      const documentData = await getDocumentService.execute(docId)
      return res.status(200).json(documentData)
    } catch (error: any) {
      console.error('Erro ao obter documento:', error)
      return res.status(500).json({ error: error.message })
    }
  }
}

export { GetFileController }
