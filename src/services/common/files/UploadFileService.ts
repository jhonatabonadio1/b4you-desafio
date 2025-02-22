import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { defaultApplicationRules } from '../../../config/DefaultApplicationRules'
import { prismaClient } from '../../../database/prismaClient'

dotenv.config()

const prisma = new PrismaClient()

class UploadFileService {
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

  private async checkUserStorage(
    userId: string,
    fileSize: number,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pdfs: true },
    })

    let userStorageLimit = defaultApplicationRules.storage.limit

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        user: {
          id: userId,
        },
        status: '',
        endDate: { lte: new Date() },
      },
      select: {
        plan: true,
      },
    })

    if (buscaInscricaoUsuário) {
      userStorageLimit = buscaInscricaoUsuário.plan.limit
    }

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const totalStorageUsed = user.pdfs.reduce(
      (sum, doc) => sum + doc.sizeInBytes / 100,
      0,
    )

    return totalStorageUsed + fileSize <= userStorageLimit
  }

  async execute(filePath: string, originalName: string, userId: string) {
    let maxFileSize = defaultApplicationRules.documents.maxSize
    let maxFilesCount = defaultApplicationRules.documents.uploadFiles

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        user: {
          id: userId,
        },
        status: '',
        endDate: { lte: new Date() },
      },
      select: {
        plan: true,
      },
    })

    if (buscaInscricaoUsuário) {
      maxFileSize = buscaInscricaoUsuário.plan.maxSize
      maxFilesCount = buscaInscricaoUsuário.plan.uploadFiles
    }

    const findDocumentsUploaded = await prisma.document.count({
      where: {
        user: {
          id: userId,
        },
      },
    })

    if (findDocumentsUploaded >= maxFilesCount) {
      throw new Error(
        'Limite de documentos atingido. Faça o upgrade para continuar.',
      )
    }

    if (!originalName) {
      throw new Error('O nome do arquivo não pode ser nulo')
    }

    const ext = path.extname(originalName).toLowerCase()

    if (ext !== '.pdf') {
      throw new Error('Apenas arquivos PDF são permitidos')
    }

    const fileStats = await fs.stat(filePath)
    if (fileStats.size / 100 > maxFileSize) {
      throw new Error(
        'O arquivo excede o limite de ' + maxFileSize / 1024 + 'MB',
      )
    }

    const isAllowed = await this.checkUserStorage(userId, fileStats.size / 100)
    if (!isAllowed) {
      throw new Error(
        'Limite total de armazenamento atingido. Faça upgrade so seu plano para continuar.',
      )
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
