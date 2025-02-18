import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

class DeleteFileService {
  private s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }

  /**
   * Deleta um documento do banco e do S3
   * @param docId - ID do documento
   * @param userId - ID do usuário autenticado
   */
  async execute(docId: string, userId: string): Promise<void> {
    // 1. Verificar se o documento existe e pertence ao usuário
    const document = await prisma.document.findUnique({
      where: { id: docId },
    })

    if (!document) {
      throw new Error('Documento não encontrado.')
    }

    if (document.userId !== userId) {
      throw new Error('Você não tem permissão para excluir este documento.')
    }

    // 2. Deletar arquivo do S3
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `secure_uploads/${document.s3Key}`,
    }

    await this.s3.send(new DeleteObjectCommand(deleteParams))
    // Delete dependent records first

    // Agora, deletar o documento principal
    await prisma.document.delete({
      where: { id: docId },
    })
  }
}

export { DeleteFileService }
