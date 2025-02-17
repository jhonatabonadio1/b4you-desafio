import dotenv from 'dotenv'
import { prismaClient } from '../../../database/prismaClient'

dotenv.config()

class GetFileService {
  async execute(documentId: string) {
    if (!documentId) {
      throw new Error('O ID do documento é obrigatório.')
    }

    // 🔹 Busca o documento no banco de dados
    const document = await prismaClient.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      throw new Error('Documento não encontrado ou sem permissão.')
    }

    // 🔹 URL via CloudFront (sem assinatura)
    const fileKey = `secure_uploads/${document.s3Key}`
    const fileUrl = `${process.env.CLOUDFRONT_URL}/${fileKey}`

    return {
      title: document.title,
      url: fileUrl, // 🔥 Link temporário seguro via CloudFront
    }
  }
}

export { GetFileService }
