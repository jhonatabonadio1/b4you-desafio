import { Request, Response } from 'express'
import { DeleteFileService } from '../../../services/common/files/DeleteFileService'

class DeleteFileController {
  async handle(req: Request, res: Response) {
    try {
      const { docId } = req.params // /files/:docId
      const userId = req.userId // ID do usuário autenticado

      if (!docId) {
        return res
          .status(400)
          .json({ error: 'ID do documento não foi fornecido.' })
      }

      const deleteFileService = new DeleteFileService()
      await deleteFileService.execute(docId, userId)

      return res
        .status(200)
        .json({ message: 'Documento excluído com sucesso.' })
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }
}

export { DeleteFileController }
