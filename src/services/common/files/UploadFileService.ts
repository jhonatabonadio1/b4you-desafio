import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

class UploadFileService {
  private s3: S3Client
  private maxFileSize = 100 * 1024 * 1024 // 10MB
  private userStorageLimit = 50 * 1024 * 1024 // 50MB

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
   * Verifica se o usuário não ultrapassou o limite de armazenamento
   */
  private async checkUserStorage(
    userId: string,
    fileSize: number,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pdfs: true },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const totalStorageUsed = user.pdfs.reduce(
      (sum, doc) => sum + doc.sizeInBytes,
      0,
    )

    return totalStorageUsed + fileSize <= this.userStorageLimit
  }

  /**
   * Faz upload seguro do arquivo PDF para o AWS S3 e registra no banco
   */
  async execute(filePath: string, originalName: string, userId: string) {
    if (!originalName) {
      throw new Error('O nome do arquivo não pode ser nulo')
    }

    const ext = path.extname(originalName).toLowerCase()

    if (ext !== '.pdf') {
      throw new Error('Apenas arquivos PDF são permitidos')
    }

    const fileStats = await fs.stat(filePath)
    if (fileStats.size > this.maxFileSize) {
      throw new Error('O arquivo excede o limite de 10MB')
    }

    const isAllowed = await this.checkUserStorage(userId, fileStats.size)
    if (!isAllowed) {
      throw new Error('Limite total de armazenamento de 50MB atingido')
    }

    const fileName = `${uuidv4()}_${originalName}`
    const fileBuffer = await fs.readFile(filePath)

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `secure_uploads/${fileName}`,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    }

    await this.s3.send(new PutObjectCommand(uploadParams))

    const document = await prisma.document.create({
      data: {
        title: originalName,
        s3Key: fileName,
        iframe: '',
        sizeInBytes: fileStats.size,
        userId,
      },
    })

    await fs.unlink(filePath) // Remove o arquivo local

    return document
  }
}

export { UploadFileService }
