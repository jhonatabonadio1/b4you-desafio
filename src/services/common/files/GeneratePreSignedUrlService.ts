import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { defaultApplicationRules } from '../../../config/DefaultApplicationRules'
import { prismaClient } from '../../../database/prismaClient'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

dotenv.config()

const prisma = new PrismaClient()

interface Props {
  fileName: string
  fileType: string
  sizeInBytes: number
  userId: string
}

class GeneratePreSignedUrlService {
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
        userId,
        status: 'active',
        endDate: {
          gte: new Date(),
        },
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

  async execute({ fileName, fileType, sizeInBytes, userId }: Props) {
    let maxFileSize = defaultApplicationRules.documents.maxSize
    let maxFilesCount = defaultApplicationRules.documents.uploadFiles

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        userId,
        status: 'active',
        endDate: {
          gte: new Date(),
        },
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

    const randomHex = crypto.randomBytes(8).toString('hex')

    const ext = path.extname(String(fileName)).toLowerCase()
    const key = `secure_uploads/${randomHex}_${fileName}`

    if (ext !== '.pdf') {
      throw new Error('Apenas arquivos PDF são permitidos')
    }

    if (sizeInBytes / 100 > maxFileSize) {
      throw new Error(
        'O arquivo excede o limite de ' + maxFileSize / 1024 + 'MB',
      )
    }

    const isAllowed = await this.checkUserStorage(userId, sizeInBytes / 100)
    if (!isAllowed) {
      throw new Error(
        'Limite total de armazenamento atingido. Faça upgrade so seu plano para continuar.',
      )
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: String(fileType),
    })

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 })

    const data = {
      uploadUrl,
      key,
    }

    return data
  }
}

export { GeneratePreSignedUrlService }
