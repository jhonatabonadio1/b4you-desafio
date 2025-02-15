import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import dotenv from 'dotenv'
import { prismaClient } from '../../../database/prismaClient'

dotenv.config()

class GetFileService {
  private s3: S3Client
  private signedUrlExpiry = 60 * 5 // 🔥 Link válido por 5 minutos

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }

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

    // 🔹 Gera um link assinado (temporário) para acesso seguro
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `secure_uploads/${document.s3Key}`,
    })

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.signedUrlExpiry,
    })

    return {
      title: document.title,
      url: signedUrl, // 🔥 Link temporário seguro
    }
  }
}

export { GetFileService }
